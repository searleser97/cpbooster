"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[847],{3708:(e,t,s)=>{s.r(t),s.d(t,{assets:()=>i,contentTitle:()=>o,default:()=>h,frontMatter:()=>r,metadata:()=>n,toc:()=>l});const n=JSON.parse('{"id":"add-language-support","title":"Add Language Support","description":"A good place to start looking at is here//github.com/searleser97/cpbooster/blob/33f274c030015bb555824d5ba7a4c1b11776257a/app/src/Test/TesterFactory/TesterFactory.ts","source":"@site/docs/addLanguageSupport.mdx","sourceDirName":".","slug":"/add-language-support","permalink":"/cpbooster/docs/add-language-support","draft":false,"unlisted":false,"editUrl":"https://github.com/facebook/docusaurus/edit/master/website/docs/addLanguageSupport.mdx","tags":[],"version":"current","frontMatter":{"id":"add-language-support","title":"Add Language Support"},"sidebar":"docs","previous":{"title":"Add Editor Support","permalink":"/cpbooster/docs/add-editor-support"},"next":{"title":"Add Online Judge Support","permalink":"/cpbooster/docs/add-online-judge-support"}}');var a=s(4848),c=s(8453);const r={id:"add-language-support",title:"Add Language Support"},o=void 0,i={},l=[{value:"Interpreted",id:"interpreted",level:3},{value:"Compiled",id:"compiled",level:3},{value:"Mixed",id:"mixed",level:3},{value:"<code>template.java</code>",id:"templatejava",level:6}];function d(e){const t={a:"a",admonition:"admonition",code:"code",h3:"h3",h6:"h6",p:"p",pre:"pre",strong:"strong",...(0,c.R)(),...e.components};return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsxs)(t.p,{children:["A good place to start looking at is here: ",(0,a.jsx)(t.a,{href:"https://github.com/searleser97/cpbooster/blob/33f274c030015bb555824d5ba7a4c1b11776257a/app/src/Test/TesterFactory/TesterFactory.ts",children:"https://github.com/searleser97/cpbooster/blob/33f274c030015bb555824d5ba7a4c1b11776257a/app/src/Test/TesterFactory/TesterFactory.ts"})]}),"\n",(0,a.jsxs)(t.p,{children:["where you will find that we have three main clases that represent ",(0,a.jsx)(t.code,{children:"compiled"}),", ",(0,a.jsx)(t.code,{children:"interpreted"})," and ",(0,a.jsx)(t.code,{children:"mixed"})," languages."]}),"\n",(0,a.jsx)(t.h3,{id:"interpreted",children:"Interpreted"}),"\n",(0,a.jsx)(t.p,{children:"Usually, all interpreted languages have the same syntax to run a file:"}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-shell",children:"interpreter filename.[extension]\n"})}),"\n",(0,a.jsx)(t.p,{children:"e.g."}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-shell",children:"$ python filename.py\n$ ruby filename.rb\n$ node filname.js\n...\n"})}),"\n",(0,a.jsxs)(t.p,{children:["therefore, ",(0,a.jsx)(t.code,{children:"cpbooster"})," should support absolutely all ",(0,a.jsx)(t.code,{children:"interpreted"})," languages."]}),"\n",(0,a.jsxs)(t.p,{children:["The issue comes when we use either ",(0,a.jsx)(t.code,{children:"compiled"})," or ",(0,a.jsx)(t.code,{children:"interpreted"})," languages, specifically\nwhen it comes to indicate the name for the executable (binary) file."]}),"\n",(0,a.jsx)(t.h3,{id:"compiled",children:"Compiled"}),"\n",(0,a.jsxs)(t.p,{children:["Compilers like ",(0,a.jsx)(t.code,{children:"gcc"}),", ",(0,a.jsx)(t.code,{children:"clang"}),", ",(0,a.jsx)(t.code,{children:"rustc"}),", ",(0,a.jsx)(t.code,{children:"go"}),", ... use the ",(0,a.jsx)(t.code,{children:"-o"})," argument to indicate\nthe name for the executable file."]}),"\n",(0,a.jsx)(t.p,{children:"e.g."}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-shell",children:"gcc filename.cpp -o myexecutable.exe\ngo build filename.go -o myexecutable.exe\nrustc filename.rs -o myexecutable.exe\n...\n"})}),"\n",(0,a.jsx)(t.p,{children:"However, there might exist some other compilers that do not follow this convention and they\nprobably use a different argument, to solve this we have the following function"}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-ts",children:'static getFileNameOptionForCompilerCommand(compilerCommand: string): string {\n  return CompiledTester.fileNameOptionForCommand.get(compilerCommand) ?? "-o";\n}\n'})}),"\n",(0,a.jsx)(t.p,{children:(0,a.jsx)(t.a,{href:"https://github.com/searleser97/cpbooster/blob/33f274c030015bb555824d5ba7a4c1b11776257a/app/src/Test/TesterFactory/CompiledTester.ts#L111-L113",children:"https://github.com/searleser97/cpbooster/blob/33f274c030015bb555824d5ba7a4c1b11776257a/app/src/Test/TesterFactory/CompiledTester.ts#L111-L113"})}),"\n",(0,a.jsxs)(t.p,{children:["which uses a ",(0,a.jsx)(t.code,{children:"Map"})," (hash table)\nto retrieve the correct argument name depending on the compiler command (",(0,a.jsx)(t.code,{children:"gcc"}),", ",(0,a.jsx)(t.code,{children:"g++"}),", ",(0,a.jsx)(t.code,{children:"csc"}),", ",(0,a.jsx)(t.code,{children:"go"}),", ...),\nif the compiler does not exist in the hash table (",(0,a.jsx)(t.code,{children:"Map"}),") it defaults to the ",(0,a.jsx)(t.code,{children:"-o"})," argument name."]}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-ts",children:'private static fileNameOptionForCommand: Map<string, string> = new Map([\n  [NonStandardCompilers.mcs, "-out:"], // csharp compiler\n  [NonStandardCompilers.csc, "/out:"] // csharp compiler\n]);\n'})}),"\n",(0,a.jsx)(t.p,{children:(0,a.jsx)(t.a,{href:"https://github.com/searleser97/cpbooster/blob/33f274c030015bb555824d5ba7a4c1b11776257a/app/src/Test/TesterFactory/CompiledTester.ts#L37-L40",children:"https://github.com/searleser97/cpbooster/blob/33f274c030015bb555824d5ba7a4c1b11776257a/app/src/Test/TesterFactory/CompiledTester.ts#L37-L40"})}),"\n",(0,a.jsxs)(t.p,{children:["notice that in the hash table (",(0,a.jsx)(t.code,{children:"Map"}),") we just have ",(0,a.jsx)(t.code,{children:"msc"})," and ",(0,a.jsx)(t.code,{children:"csc"})," which are ",(0,a.jsx)(t.code,{children:"C#"})," compilers, this is because\nall the tested languages except for ",(0,a.jsx)(t.code,{children:"C#"})," use the ",(0,a.jsx)(t.code,{children:"-o"})," argument therefore there is no need to insert them into the hash table."]}),"\n",(0,a.jsxs)(t.p,{children:["Now let's actually talk about ",(0,a.jsx)(t.code,{children:"C#"})," compilers and how they conflict with the standard format. It turns out that these compilers\nnot just use a different argument name to sepecify the executable name, but they also force us to write the name of the executable\ntogether with the argument name (i.e. not separated by a space)"]}),"\n",(0,a.jsx)(t.p,{children:"e.g."}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-shell",children:"mcs -out:myexecutable.exe filename.cs\ncsc /out:myexecutable.exe filename.cs\n"})}),"\n",(0,a.jsxs)(t.p,{children:["to solve this when we compile we have an special condition, which basically checks if the compiler is NOT standard (i.e. ",(0,a.jsx)(t.code,{children:"csc"})," and ",(0,a.jsx)(t.code,{children:"mcs"}),")\nthen join/concatenate the argument name with the executable name."]}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-ts",children:"if (Object.keys(NonStandardCompilers).includes(compilerCommand)) {\n  args.push(\n    CompiledTester.getFileNameOptionForCompilerCommand(compilerCommand) +\n      this.getDefaultExecutableFileName(debug)\n  );\n} else {\n  args.push(\n    CompiledTester.getFileNameOptionForCompilerCommand(compilerCommand),\n    this.getDefaultExecutableFileName(debug)\n  );\n}\n"})}),"\n",(0,a.jsx)(t.p,{children:(0,a.jsx)(t.a,{href:"https://github.com/searleser97/cpbooster/blob/33f274c030015bb555824d5ba7a4c1b11776257a/app/src/Test/TesterFactory/CompiledTester.ts#L144-L154",children:"https://github.com/searleser97/cpbooster/blob/33f274c030015bb555824d5ba7a4c1b11776257a/app/src/Test/TesterFactory/CompiledTester.ts#L144-L154"})}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-ts",children:'export enum NonStandardCompilers {\n  mcs = "mcs",\n  csc = "csc",\n}\n'})}),"\n",(0,a.jsx)(t.p,{children:(0,a.jsx)(t.a,{href:"https://github.com/searleser97/cpbooster/blob/33f274c030015bb555824d5ba7a4c1b11776257a/app/src/Test/TesterFactory/CompiledTester.ts#L31-L34",children:"https://github.com/searleser97/cpbooster/blob/33f274c030015bb555824d5ba7a4c1b11776257a/app/src/Test/TesterFactory/CompiledTester.ts#L31-L34"})}),"\n",(0,a.jsx)(t.h3,{id:"mixed",children:"Mixed"}),"\n",(0,a.jsxs)(t.p,{children:[(0,a.jsx)(t.code,{children:"mixed"})," languages are the ones that are compiled with one command but executed with another one (not counting ",(0,a.jsx)(t.code,{children:"./executable.exe"})," format as command)\ne.g. programs written in ",(0,a.jsx)(t.code,{children:"Java"})," are compiled using the ",(0,a.jsx)(t.code,{children:"javac"})," command and then executed using the ",(0,a.jsx)(t.code,{children:"java"})," command, something similar\nhappens with languages like ",(0,a.jsx)(t.code,{children:"Kotlin"})," and ",(0,a.jsx)(t.code,{children:"Scala"}),"."]}),"\n",(0,a.jsxs)(t.p,{children:["Usually, these languages generate a ",(0,a.jsx)(t.code,{children:".class"})," file after compilation, this ",(0,a.jsx)(t.code,{children:".class"})," file usually has the same name as the source file name or\nthe same name as the ",(0,a.jsx)(t.code,{children:"class"})," declared inside it. ",(0,a.jsx)(t.code,{children:"cpbooster"})," takes advantage of this behavior and therefore, no extra code is written to name\nthe executables (",(0,a.jsx)(t.code,{children:".class"})," files), except for ",(0,a.jsx)(t.code,{children:"kotlin"})," which adds ",(0,a.jsx)(t.code,{children:"Kt"})," to the executable name, we have that case covered with a simple ",(0,a.jsx)(t.code,{children:"if"}),"\ncondition here:"]}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-ts",children:'getExecutableFileName(): string {\n  return `${this.getExecutableFileNameNoExtension()}${\n    this.langExtension === LangExtensions.kotlin ? "Kt" : ""\n  }.class`;\n}\n'})}),"\n",(0,a.jsx)(t.p,{children:(0,a.jsx)(t.a,{href:"https://github.com/searleser97/cpbooster/blob/33f274c030015bb555824d5ba7a4c1b11776257a/app/src/Test/TesterFactory/MixedTester.ts#L36",children:"https://github.com/searleser97/cpbooster/blob/33f274c030015bb555824d5ba7a4c1b11776257a/app/src/Test/TesterFactory/MixedTester.ts#L36"})}),"\n",(0,a.jsxs)(t.admonition,{type:"note",children:[(0,a.jsxs)(t.p,{children:["Currently, to guarantee the correct behavior of ",(0,a.jsx)(t.code,{children:"cpbooster"}),", the ",(0,a.jsx)(t.code,{children:"class"})," name should match with the source file name, since\nsome languages use the ",(0,a.jsx)(t.code,{children:"class"})," name as the executable (",(0,a.jsx)(t.code,{children:".class"}),") name instead of the source file name."]}),(0,a.jsxs)(t.p,{children:["Which leads to a possible ",(0,a.jsx)(t.strong,{children:"contribution"}),' related with the "templates" for languages that require the declaration of a class.\nWe can add the concept of ',(0,a.jsx)(t.code,{children:"cpbooster-variables"})," which will be formatted strings that will get replaced with some information,\nlike filename or date, etc"]}),(0,a.jsx)(t.p,{children:"e.g."}),(0,a.jsx)(t.h6,{id:"templatejava",children:(0,a.jsx)(t.code,{children:"template.java"})}),(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-java",children:"/**\n * Date Time: $${DateTime}$$\n */\n\nimport java.util.*;\n\npublic class $${FileName}$$   <-- just a suggested syntax not sure if its the best\n{\n\n    public static void main(String[] args)\n    {\n\n    }\n}\n"})}),(0,a.jsxs)(t.p,{children:["then if we create a file ",(0,a.jsx)(t.code,{children:"ProblemC.java"})," with ",(0,a.jsx)(t.code,{children:"cpbooster"})," the file will look like this:"]}),(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-java",children:'/**\n * DateTime: 13-07-2022 13:30      <-- $${DateTime}$$ was replaced with the "current" date time\n */\n\nimport java.util.*;\n\npublic class ProblemC     <-- $${FileName}$$ was replaced with ProblemC\n{\n\n    public static void main(String[] args)\n    {\n\n    }\n}\n'})}),(0,a.jsxs)(t.p,{children:["one thing to note here is that we will also need to force the file name to have the first letter capitalized (in uppercase),\nsince some ",(0,a.jsx)(t.code,{children:"mixed"})," languages do not allow to create classes that do not have the first letter in uppercase."]})]})]})}function h(e={}){const{wrapper:t}={...(0,c.R)(),...e.components};return t?(0,a.jsx)(t,{...e,children:(0,a.jsx)(d,{...e})}):d(e)}},8453:(e,t,s)=>{s.d(t,{R:()=>r,x:()=>o});var n=s(6540);const a={},c=n.createContext(a);function r(e){const t=n.useContext(c);return n.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function o(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:r(e.components),n.createElement(c.Provider,{value:t},e.children)}}}]);