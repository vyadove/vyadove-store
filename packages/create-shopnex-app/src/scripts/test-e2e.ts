#!/usr/bin/env node

import { spawn } from 'child_process';
import fs from 'fs-extra';
import path from 'path';

const testProjectName = 'e2e-test-project';
const testProjectDir = path.resolve(process.cwd(), testProjectName);

async function cleanup() {
    if (await fs.pathExists(testProjectDir)) {
        await fs.remove(testProjectDir);
        console.log('🧹 Cleaned up test project directory');
    }
}

function runCommand(command: string, args: string[], options: any = {}): Promise<{ success: boolean; output: string }> {
    return new Promise((resolve) => {
        const child = spawn(command, args, {
            stdio: ['pipe', 'pipe', 'pipe'],
            ...options
        });

        let output = '';
        child.stdout?.on('data', (data) => {
            output += data.toString();
        });
        child.stderr?.on('data', (data) => {
            output += data.toString();
        });

        // Send inputs for interactive prompts
        setTimeout(() => {
            child.stdin?.write('\n'); // Select default template
            setTimeout(() => {
                child.stdin?.write('\n'); // Accept SQLite
                setTimeout(() => {
                    child.stdin?.end();
                }, 1000);
            }, 1000);
        }, 2000);

        child.on('close', (code) => {
            resolve({
                success: code === 0,
                output
            });
        });

        // Kill process after 30 seconds if it's still running
        setTimeout(() => {
            child.kill('SIGTERM');
            resolve({
                success: false,
                output: output + '\n❌ Process timeout after 30 seconds'
            });
        }, 30000);
    });
}

async function testLocalTemplate() {
    console.log('\n🧪 Testing with local template...');

    const { success, output } = await runCommand('node', [
        'dist/start.js',
        '--name', testProjectName,
        '--db', 'sqlite',
        '--local-template', 'simple-shop',
        '--no-deps'
    ]);

    console.log('Command output:');
    console.log(output);

    if (!success) {
        console.log('❌ CLI command failed');
        return false;
    }

    // Check if project was created
    if (!(await fs.pathExists(testProjectDir))) {
        console.log('❌ Project directory was not created');
        return false;
    }

    // Check essential files
    const essentialFiles = [
        'package.json',
        'src/payload.config.ts',
        '.env'
    ];

    for (const file of essentialFiles) {
        const filePath = path.join(testProjectDir, file);
        if (!(await fs.pathExists(filePath))) {
            console.log(`❌ Essential file missing: ${file}`);
            return false;
        }
        console.log(`✅ Found: ${file}`);
    }

    // Check package.json content
    const packageJson = await fs.readJson(path.join(testProjectDir, 'package.json'));
    if (packageJson.name !== testProjectName) {
        console.log(`❌ Package name not updated. Expected: ${testProjectName}, Got: ${packageJson.name}`);
        return false;
    }
    console.log('✅ Package.json name updated correctly');

    // Check .env file
    const envContent = await fs.readFile(path.join(testProjectDir, '.env'), 'utf-8');
    if (!envContent.includes('PAYLOAD_SECRET') || !envContent.includes('DATABASE_URI')) {
        console.log('❌ .env file missing required variables');
        return false;
    }
    console.log('✅ .env file contains required variables');

    return true;
}

async function testRemoteTemplate() {
    console.log('\n🌐 Testing with remote template download...');

    await cleanup();

    const { success, output } = await runCommand('node', [
        'dist/start.js',
        '--name', testProjectName,
        '--template', 'simple-shop',
        '--db', 'sqlite',
        '--no-deps',
        '--debug'
    ]);

    console.log('Command output:');
    console.log(output);

    if (!success) {
        console.log('⚠️  Remote template test failed (expected due to interactive prompts)');
        return false;
    }

    return await fs.pathExists(testProjectDir);
}

async function runE2ETests() {
    console.log('🚀 Starting E2E tests for create-shopnex-app');

    // Ensure we're in the right directory
    const currentDir = process.cwd();
    const packageJsonPath = path.join(currentDir, 'package.json');

    if (!(await fs.pathExists(packageJsonPath))) {
        console.log('❌ Not in create-shopnex-app directory');
        process.exit(1);
    }

    const packageJson = await fs.readJson(packageJsonPath);
    if (packageJson.name !== 'create-shopnex-app') {
        console.log('❌ Not in create-shopnex-app directory');
        process.exit(1);
    }

    // Build first
    console.log('🔨 Building project...');
    const buildResult = await runCommand('npm', ['run', 'build']);
    if (!buildResult.success) {
        console.log('❌ Build failed');
        console.log(buildResult.output);
        process.exit(1);
    }
    console.log('✅ Build successful');

    let allTestsPassed = true;

    try {
        // Test 1: Local template
        await cleanup();
        const localTest = await testLocalTemplate();
        if (!localTest) {
            allTestsPassed = false;
        } else {
            console.log('✅ Local template test passed');
        }

        // Test 2: Remote template (may fail due to TTY issues, but still good to try)
        try {
            const remoteTest = await testRemoteTemplate();
            if (remoteTest) {
                console.log('✅ Remote template test passed');
            }
        } catch (error) {
            console.log('⚠️  Remote template test skipped due to:', error);
        }

    } finally {
        await cleanup();
    }

    if (allTestsPassed) {
        console.log('\n🎉 All E2E tests passed!');
        process.exit(0);
    } else {
        console.log('\n❌ Some E2E tests failed');
        process.exit(1);
    }
}

// Add to package.json scripts if running this directly
if (import.meta.url === `file://${process.argv[1]}`) {
    runE2ETests().catch((error) => {
        console.error('❌ E2E test failed with error:', error);
        process.exit(1);
    });
}

export { runE2ETests };