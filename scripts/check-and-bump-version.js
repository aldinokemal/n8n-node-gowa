const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

try {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJson = require(packageJsonPath);
    const packageName = packageJson.name;
    const currentVersion = packageJson.version;

    console.log(`Checking version for ${packageName}...`);
    console.log(`Current local version: ${currentVersion}`);

    let npmVersion = '';
    try {
        npmVersion = execSync(`npm view ${packageName} version`, { encoding: 'utf8' }).trim();
        console.log(`Latest published version: ${npmVersion}`);
    } catch (e) {
        if (e.message.includes('E404')) {
            console.log('Package not found on npm. Publishing as is.');
            process.exit(0);
        }
        // If other error, we might assume it's not published or network error, 
        // but for safety let's proceed to check version comparison if we got something back
    }

    if (npmVersion === currentVersion) {
        console.log('Versions match. Incrementing patch version...');
        
        // Split version into parts (major.minor.patch)
        const parts = currentVersion.split('.').map(Number);
        
        // Increment patch version
        parts[2] += 1;
        
        const newVersion = parts.join('.');
        console.log(`New version will be: ${newVersion}`);
        
        // Update package.json
        packageJson.version = newVersion;
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
        
        // Also run npm version to update package-lock.json if it exists
        try {
             // We use --no-git-tag-version because we'll handle git operations separately or let the action handle it
             // Actually, writing the file manually above is enough for the publish step, 
             // but `npm version` ensures consistency with package-lock.json
             execSync(`npm version ${newVersion} --no-git-tag-version --allow-same-version`);
        } catch (err) {
            console.warn('Failed to run npm version command, but package.json was updated manually.');
        }

        console.log(`Updated package.json to version ${newVersion}`);
        
        // Set output for GitHub Actions
        const githubOutput = process.env.GITHUB_OUTPUT;
        if (githubOutput) {
            fs.appendFileSync(githubOutput, `new_version=${newVersion}\n`);
            fs.appendFileSync(githubOutput, `version_bumped=true\n`);
        }
    } else {
        console.log('Local version is different from npm version. Proceeding with local version.');
         const githubOutput = process.env.GITHUB_OUTPUT;
        if (githubOutput) {
            fs.appendFileSync(githubOutput, `version_bumped=false\n`);
        }
    }

} catch (error) {
    console.error('Error checking/updating version:', error);
    process.exit(1);
}
