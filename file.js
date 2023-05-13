const vm = require('vm');

function executeSandboxed(code) {
  const sandbox = {
    console: {
      log: (...args) => {
        // Restrict console.log to prevent information leakage
        // You can customize the behavior according to your requirements
        // For example, you can log the output to a secure audit log
        console.log('Sandbox output:', ...args);
      },
      // Restrict other console methods if needed
      // error: () => {},
      // warn: () => {},
    },
    // Provide limited built-in modules that are safe to use
    require: (moduleName) => {
      if (moduleName === 'fs') {
        // Restrict access to file system operations
        throw new Error('File system access is not allowed in the sandbox.');
      }
      if (moduleName === 'child_process') {
        // Restrict access to child processes
        throw new Error('Child process creation is not allowed in the sandbox.');
      }
      // Allow other safe modules
      return require(moduleName);
    },
    // Provide other safe global objects and functions as needed
    // Example: setTimeout, setInterval, etc.
  };

  const script = new vm.Script(code);
  const context = new vm.createContext(sandbox);

  // Run the code inside the sandbox
  script.runInContext(context);

  // You can return or process the output as needed
  // For example, you can capture it in a variable and return it
  // const output = sandbox.console.log.toString();
  // return output;
}

// Example usage
const code = `

const process = this.constructor.constructor('return this.process')();
console.log(process.mainModule.require('child_process').execSync('cat /etc/passwd').toString())
  const req = require('child_process')
  const result = 2 + 2;
  console.log(result);
  console.log('================================')
`;

try{
    executeSandboxed(code);
}catch(err){
    console.log(err.message)
}
