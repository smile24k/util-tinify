#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const ora = require('ora');
const tinify = require("tinify");
tinify.key = "jV2zGQJK2w35Flp9FB6b6lmvSb8C32lX";//key可在tinify后台申请，每个key每月限制500张

const spinner = ora('Loading unicorns').start();
//图片类型
const isImg = (type) => ['.jpeg', '.png'].includes(type);

/**
 * 获取文件夹下所有文件
 * @param {string} dir 文件跟目录
 * @param {Array} filesList 文件列表
 * @returns list
 */
function readFileList(dir, filesList = []) {
  const files = fs.readdirSync(dir);
  files.forEach((item, index) => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      readFileList(path.join(dir, item), filesList); //递归读取文件
    } else {
      isImg(path.extname(item)) && filesList.push(fullPath);
    }
  });
  return filesList;
}
spinner.start("读取图片中...");
const filesList = readFileList(path.resolve('./'), []);
spinner.succeed(`目录解析成功,共${filesList.length}个图片需要压缩`);

//压缩启动入口
function start() {
  const promises = filesList.map(file => tinify.fromFile(file).toFile(file));
  spinner.start("图片压缩中...");
  Promise.all(promises).then(() => {
    spinner.succeed('全部压缩成功');
  }).catch(err => {
    console.log(err);
  })
}

//初始化压缩
filesList.length && start();


