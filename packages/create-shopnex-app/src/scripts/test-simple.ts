#!/usr/bin/env node

import fs from 'fs-extra';
import path from 'path';
import { createProject } from '../lib/create-project.js';
import { getValidTemplates } from '../lib/templates.js';
import { generateSecret } from '../lib/generate-secret.js';
import { manageEnvFiles } from '../lib/manage-env-files.js';

const testProjectName = 'simple-test-project';
const testProjectDir = path.resolve(process.cwd(), testProjectName);

async function cleanup() {
    if (await fs.pathExists(testProjectDir)) {
        await fs.remove(testProjectDir);
        console.log('🧹 Cleaned up test project directory');
    }
}

async function testCreateProject() {
    console.log('🧪 Testing create-shopnex-app functionality...');

    // Clean up first
    await cleanup();

    try {
        const templates = getValidTemplates();
        console.log('✅ Templates loaded:', templates.map(t => t.name));

        const template = templates[0];

        // Test createProject with local template
        await createProject({
            cliArgs: {
                _: ['test'],
                '--local-template': 'simple-shop',
                '--no-deps': true,
                '--no-git': true
            } as any,
            template,
            packageManager: 'npm',
            projectDir: testProjectDir,
            projectName: testProjectName,
            dbDetails: {
                type: 'sqlite',
                dbUri: `file:./${testProjectName}.db`
            }
        });

        // Check if project was created
        if (!(await fs.pathExists(testProjectDir))) {
            throw new Error('Project directory was not created');
        }
        console.log('✅ Project directory created');

        // Check essential files
        const essentialFiles = ['package.json', 'src/payload.config.ts'];

        for (const file of essentialFiles) {
            const filePath = path.join(testProjectDir, file);
            if (!(await fs.pathExists(filePath))) {
                throw new Error(`Essential file missing: ${file}`);
            }
            console.log(`✅ Found: ${file}`);
        }

        // Check package.json content
        const packageJson = await fs.readJson(path.join(testProjectDir, 'package.json'));
        if (packageJson.name !== testProjectName) {
            throw new Error(`Package name not updated. Expected: ${testProjectName}, Got: ${packageJson.name}`);
        }
        console.log('✅ Package.json name updated correctly');

        // Check .env file
        const envPath = path.join(testProjectDir, '.env');
        if (await fs.pathExists(envPath)) {
            const envContent = await fs.readFile(envPath, 'utf-8');
            if (!envContent.includes('PAYLOAD_SECRET') || !envContent.includes('DATABASE_URI')) {
                throw new Error('.env file missing required variables');
            }
            console.log('✅ .env file contains required variables');
        }

        console.log('\n🎉 All tests passed! create-shopnex-app is working correctly.');
        return true;

    } catch (error) {
        console.error('❌ Test failed:', error instanceof Error ? error.message : String(error));
        return false;
    } finally {
        await cleanup();
    }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    testCreateProject().then(success => {
        process.exit(success ? 0 : 1);
    });
}

export { testCreateProject };