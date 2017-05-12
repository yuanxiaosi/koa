# koa
基于koa多应用服务（node>7.0.0）


/src/root 为载体，承载src/project里面的多应用

/hanger 为应用模板存放

/bin 构建指令


#1 安装
npm i

#2 构建应用
npm run b [hangerName]  //基于hanger里面的react 作为demo 去构建

#3  应用安装依赖
npm run i [projectName]

#4  webpack编译打包应用 (有监听文件改变)
npm run w [projectName]

#5  启动服务
npm run s


http://localhost:3000/mz/[projectName]/index


project里面应用与应用不会冲突，有单独的依赖;
你也可以在应用之间互相访问,也可以通过root设置公共;





