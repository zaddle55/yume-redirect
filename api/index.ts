import { VercelRequest, VercelResponse } from '@vercel/node';
// import { exec } from 'child_process';
import { readFileSync } from 'fs';

const SPECIAL_URLS: string = "";
const SPECIAL_SEED: number = 0;

const redirecrt = (req: VercelRequest, res: VercelResponse) => {
    const args: string | string[] = req.query.seed;
    if (Array.isArray(args)) {
        res.status(400).send('Bad Request');
        return;
    }

    try {
        // 解析seed参数
        const seed: number = parseInt(args) || new Date().getTime();

        let link: string = "";

        // 读取数据库json文件
        const data: string = readFileSync('./api/data.json', 'utf8');
        const links: string[] = JSON.parse(data);

        // 生成随机数
        const random: number = Math.floor(Math.random() * links.length);
        link = (seed===SPECIAL_SEED)? SPECIAL_URLS : links[random];

        // 调用python脚本
        /*
        exec(`python ./api/search.py`, (err, stdout, stderr) => {
            if (err) {
                console.error(err);
                res.status(500).send('Internal Server Error');
                return;
            }
            // res.status(200).send(stdout);
        });*/

        res.redirect(link);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

export default redirecrt;