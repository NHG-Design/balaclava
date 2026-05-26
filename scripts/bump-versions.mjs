import { readFileSync, writeFileSync } from 'fs';

const scripts = process.argv.slice(2);

if (scripts.length === 0) {
    console.log('No scripts to bump.');
    process.exit(0);
}

const versions = JSON.parse(readFileSync('versions.json', 'utf8'));

for (const name of scripts) {
    if (!(name in versions)) {
        versions[name] = '1.0.0';
        console.log(`Initialized ${name} at 1.0.0`);
    } else {
        const [major, minor, patch] = versions[name].split('.').map(Number);
        versions[name] = `${major}.${minor}.${patch + 1}`;
        console.log(`Bumped ${name} to ${versions[name]}`);
    }
}

writeFileSync('versions.json', JSON.stringify(versions, null, 2) + '\n');
