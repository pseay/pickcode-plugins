#!/usr/bin/env ts-node

import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import readline from "readline";

const promptUser = (question: string): Promise<string> => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            rl.close();
            resolve(answer);
        });
    });
};

// Per npm package name rules
const isValidPackageName = (name: string): boolean => {
    const packageNamePattern = /^(?![0-9])[a-z0-9-_]+$/;
    return (
        packageNamePattern.test(name) && name.length >= 1 && name.length <= 214
    );
};

const copyDirectory = (source: string, destination: string) => {
    const cmd = `cp -r ${source} ${destination}`;
    try {
        execSync(cmd, { stdio: "inherit" });
    } catch (error) {
        console.error(`Error copying directory: ${error}`);
        process.exit(1);
    }
};

const updatePackageJson = (modulePath: string, moduleName: string) => {
    const packageJsonPath = path.resolve(modulePath, "package.json");
    if (!fs.existsSync(packageJsonPath)) {
        console.error("package.json not found in the module directory.");
        process.exit(1);
    }

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
    packageJson.name = moduleName;

    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 4));
};

const initializeModule = async () => {
    let moduleName = await promptUser("Enter the new module's name: ");
    while (!isValidPackageName(moduleName)) {
        console.log(`${moduleName} is not a valid package.json name format`);
        moduleName = await promptUser("Enter the new module's name: ");
    }

    const moduleDir = moduleName.trim().replace(/\W+/g, "-").toLowerCase();

    const newModulePath = path.resolve(process.cwd(), `modules/${moduleDir}`);
    if (fs.existsSync(newModulePath)) {
        console.error(`A directory named "${moduleDir}" already exists.`);
        process.exit(1);
    }

    const templateDir = path.resolve(process.cwd(), "template");

    copyDirectory(templateDir, newModulePath);

    updatePackageJson(newModulePath, moduleName);

    console.log(
        `Module "${moduleName}" initialized successfully at "${newModulePath}".`
    );
};

void initializeModule().catch((e) => {
    console.error(e);
});
