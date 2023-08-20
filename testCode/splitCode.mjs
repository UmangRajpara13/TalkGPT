


const mystr = "564511312 ```javascript\nconsole.log(\"hi\");\n```"

const sourceCodePattern = /```([\s\S]*?)```/g;

console.log(mystr.match(sourceCodePattern)[0].split('\n').slice(1).join('\n'))

