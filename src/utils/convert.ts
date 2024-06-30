import * as path from 'path';
import * as fs from "fs";

function convert(headImg:string):string {
    const dir = path.join('./public/', headImg)
    let base64 = fs.readFileSync(dir, 'base64')
    return 'data:image/jpeg;base64,'+ base64
}
export default convert