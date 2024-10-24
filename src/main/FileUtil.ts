import fs from 'fs'
import path from 'path'

/**
 * 获取文件绝对路径
 * @param rootDir
 * @param filePath
 * @returns
 */
export function getAbsolutePath(rootDir: string, filePath: string) {
  return path.isAbsolute(filePath) ? filePath : path.join(rootDir, filePath)
}

//读取文件内容
export async function readFile(filePath: string) {
  if (!fs.existsSync(filePath)) {
    return ''
  }
  const data = await fs.promises.readFile(filePath, 'utf-8')
  return data
}

//写入文件内容
export async function writeFile(filePath: string, data: string) {
  await fs.promises.writeFile(filePath, data, 'utf-8')
}


/**
 * 文件遍历方法
 * @param filePath 需要遍历的文件路径
 */
export async function fileList(rootPath: string) {
  //根据文件路径读取文件，返回文件列表
  const list = await fs.promises.readdir(rootPath, { recursive: true })
  const data = list.map((file) => {
    const p = path.join(rootPath, file)
    const stat = fs.statSync(p)
    return {
      name: file,
      isDirectory: stat.isDirectory(),
      isFile: stat.isFile()
    }
  }).filter(f=>f.isFile).map(f=>f.name)
  return data
}
