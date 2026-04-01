const fs = require('fs');
const path = require('path');
const modulesDir = path.join('apps', 'api', 'src', 'modules');
fs.readdirSync(modulesDir).forEach(mod => {
  const modPath = path.join(modulesDir, mod);
  if (!fs.statSync(modPath).isDirectory()) return;
  const cFile = path.join(modPath, mod + '.controller.ts');
  const sFile = path.join(modPath, mod + '.service.ts');
  // Convert kebab-case to PascalCase
  const className = mod.split('-').map(p => p[0].toUpperCase() + p.slice(1)).join('');
  
  if (!fs.existsSync(cFile)) {
    fs.writeFileSync(cFile, "import { Controller } from '@nestjs/common';\n@Controller() export class " + className + "Controller {}\n");
    console.log('Created ' + cFile);
  }
  if (!fs.existsSync(sFile)) {
    fs.writeFileSync(sFile, "import { Injectable } from '@nestjs/common';\n@Injectable() export class " + className + "Service {}\n");
    console.log('Created ' + sFile);
  }
});
