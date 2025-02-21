"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[4204],{264:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>l,contentTitle:()=>c,default:()=>u,frontMatter:()=>a,metadata:()=>s,toc:()=>d});const s=JSON.parse('{"id":"clone","title":"Clone Contest","description":"cpbooster can clone a contest to your computer with the following command:","source":"@site/docs/clone.mdx","sourceDirName":".","slug":"/clone","permalink":"/cpbooster/docs/clone","draft":false,"unlisted":false,"editUrl":"https://github.com/facebook/docusaurus/edit/master/website/docs/clone.mdx","tags":[],"version":"current","frontMatter":{"id":"clone","title":"Clone Contest"},"sidebar":"docs","previous":{"title":"Configuration","permalink":"/cpbooster/docs/configuration"},"next":{"title":"Test","permalink":"/cpbooster/docs/test"}}');var o=t(4848),r=t(8453),i=t(9030);const a={id:"clone",title:"Clone Contest"},c=void 0,l={},d=[{value:"Demo",id:"demo",level:2},{value:"File Structure",id:"file-structure",level:2},{value:"Why Flat File Structure?",id:"why-flat-file-structure",level:2},{value:"So, leave folders and organization for more complex projects! Here you definitely DON&#39;T NEED that, it makes you slow.",id:"so-leave-folders-and-organization-for-more-complex-projects-here-you-definitely-dont-need-that-it-makes-you-slow",level:4}];function h(e){const n={a:"a",code:"code",h2:"h2",h4:"h4",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",...(0,r.R)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsxs)(n.p,{children:[(0,o.jsx)(n.code,{children:"cpbooster"})," can clone a contest to your computer with the following command:"]}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-shell",children:"cpb clone\n"})}),"\n",(0,o.jsx)(n.p,{children:"This command does 5 things:"}),"\n",(0,o.jsxs)(n.ol,{children:["\n",(0,o.jsxs)(n.li,{children:["Waits for ",(0,o.jsx)(n.a,{href:"https://github.com/jmerle/competitive-companion",children:"competitive companion extension"})," to send the data from the contest."]}),"\n",(0,o.jsxs)(n.li,{children:["Creates a folder inside your ",(0,o.jsx)(n.a,{href:"/docs/configuration#contestsdirectory-string",children:"contests directory"})," with the same name as the contest that you are cloning."]}),"\n",(0,o.jsx)(n.li,{children:"Creates source files for all the problems in the contest. Using the name of the corresponding problem as file name."}),"\n",(0,o.jsxs)(n.li,{children:["Loads the template that corresponds to your ",(0,o.jsx)(n.a,{href:"/docs/configuration#preferredlang-string",children:"preferred language"})," to each source file."]}),"\n",(0,o.jsxs)(n.li,{children:["Downloads test cases as ",(0,o.jsx)(n.code,{children:".in"})," and ",(0,o.jsx)(n.code,{children:".ans"})," files. Using the name of the corresponding problem as file name as well."]}),"\n"]}),"\n",(0,o.jsx)(n.h2,{id:"demo",children:"Demo"}),"\n",(0,o.jsx)("div",{class:"text--center",children:(0,o.jsx)("img",{alt:"test",src:(0,i.Ay)("/img/demos/clone.gif")})}),"\n",(0,o.jsx)(n.h2,{id:"file-structure",children:"File Structure"}),"\n",(0,o.jsxs)(n.p,{children:["Running ",(0,o.jsx)(n.code,{children:"ls"})," in the contest directory will show you something like the following."]}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-shell",children:"Codeforces-CodeforcesRound665Div.2$ ls\nA_DistanceandAxis.ans1  C_MereArray.ans1               E_DivideSquare.cpp\nA_DistanceandAxis.cpp   C_MereArray.cpp                E_DivideSquare.in1\nA_DistanceandAxis.in1   C_MereArray.in1                F_ReverseandSwap.ans1\nA_DistanceandAxis.out1  D_MaximumDistributedTree.ans1  F_ReverseandSwap.ans2\nB_TernarySequence.ans1  D_MaximumDistributedTree.cpp   F_ReverseandSwap.cpp\nB_TernarySequence.cpp   D_MaximumDistributedTree.in1   F_ReverseandSwap.in1\nB_TernarySequence.in1   E_DivideSquare.ans1            F_ReverseandSwap.in2\n"})}),"\n",(0,o.jsxs)(n.p,{children:["The first thing to notice is that every file that corresponds to the ",(0,o.jsx)(n.code,{children:"X"})," problem has the same name as ",(0,o.jsx)(n.code,{children:"X"}),",\nexcept for the extension. This is how ",(0,o.jsx)(n.code,{children:"cpbooster"})," identifies which testcases correspond to a certain source file.\nThis means that you could create a new test case attached to the problem ",(0,o.jsx)(n.code,{children:"A.DistanceandAxis"}),"\njust by creating the corresponding ",(0,o.jsx)(n.code,{children:"A.DistanceandAxis.in2"})," and ",(0,o.jsx)(n.code,{children:"A.DistanceandAxis.ans2"}),"\nfiles, however, ",(0,o.jsx)(n.code,{children:"cpbooster"})," has a way to automate this task. See ",(0,o.jsx)(n.a,{href:"/docs/add-test-case",children:"Add Test Case"}),". The same applies for executable files,\nthey will use the same name except for the extension, which will be ",(0,o.jsx)(n.code,{children:".exe"}),"."]}),"\n",(0,o.jsxs)(n.p,{children:["The second thing to notice is that there are ",(0,o.jsx)(n.strong,{children:"no subfolders"}),"!, the file structure is ",(0,o.jsx)(n.strong,{children:"flat"}),"!, which is just amazing for several\nreasons. See ",(0,o.jsx)(n.a,{href:"#why-flat-file-structure",children:"Why Flat File Structure?"})," to know more."]}),"\n",(0,o.jsx)(n.h2,{id:"why-flat-file-structure",children:"Why Flat File Structure?"}),"\n",(0,o.jsx)(n.p,{children:"There are several reasons why a flat file structure is preferred when it comes to competitive programming contests."}),"\n",(0,o.jsxs)(n.p,{children:["But definitely the main reason, is because we want ",(0,o.jsx)(n.strong,{children:"speed!"}),", being fast in a contest is crucial."]}),"\n",(0,o.jsx)(n.p,{children:"For example, having to change the directory like this"}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-shell",children:"$ cd ..\n$ cd ProblemB\n"})}),"\n",(0,o.jsx)(n.p,{children:"each time you switch to another problem is just so annoying and slow."}),"\n",(0,o.jsxs)(n.p,{children:["Having a flat file structure enables you to make every single file operation easier and faster,\nopening them, creating them, if you are a ",(0,o.jsx)(n.a,{href:"https://www.vim.org/about.php",children:"vim"})," or ",(0,o.jsx)(n.a,{href:"https://neovim.io/",children:"neovim"})," user you could just do"]}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-shell",children:"$ vim *.cpp\n"})}),"\n",(0,o.jsx)(n.p,{children:"to open all your source files."}),"\n",(0,o.jsxs)(n.p,{children:["or let's say you want to see or modify the contents of some test case, you could just do ",(0,o.jsx)(n.code,{children:":e ProblemName.in1"}),"\nto open the file, without changing the directory or using long relative paths."]}),"\n",(0,o.jsxs)(n.p,{children:["or imagine the situation where for some reason you just want to run your code with any of the available test cases manually\n(without using ",(0,o.jsx)(n.code,{children:"cpbooster"}),"), due to the fact that you will have a flat file structure you will be able to do it\nwithout changing the directory or using long relative paths. Just ",(0,o.jsx)(n.code,{children:"./Program.exe < Program.in1"})," or ",(0,o.jsx)(n.code,{children:"python Program.py < Program.in1"}),", etc.\nas usual."]}),"\n",(0,o.jsxs)(n.p,{children:["This simplicity will also allow you to use ",(0,o.jsx)(n.code,{children:"cpbooster"})," with any source file you already have, not just for cloned contests."]}),"\n",(0,o.jsxs)(n.p,{children:["Also, do not forget that folders ",(0,o.jsx)(n.strong,{children:"do"})," use space, even when they are empty, Why would you like to use more space just for a\ncompetitive programming contest ",(0,o.jsx)(n.strong,{children:"???"})]}),"\n",(0,o.jsx)(n.h4,{id:"so-leave-folders-and-organization-for-more-complex-projects-here-you-definitely-dont-need-that-it-makes-you-slow",children:"So, leave folders and organization for more complex projects! Here you definitely DON'T NEED that, it makes you slow."})]})}function u(e={}){const{wrapper:n}={...(0,r.R)(),...e.components};return n?(0,o.jsx)(n,{...e,children:(0,o.jsx)(h,{...e})}):h(e)}},8453:(e,n,t)=>{t.d(n,{R:()=>i,x:()=>a});var s=t(6540);const o={},r=s.createContext(o);function i(e){const n=s.useContext(r);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function a(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:i(e.components),s.createElement(r.Provider,{value:n},e.children)}}}]);