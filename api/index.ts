import { VercelRequest, VercelResponse } from '@vercel/node';
// import { exec } from 'child_process';
import { readFileSync } from 'fs';

const SPECIAL_URLS: string = "https://b23.tv/bWUfYA0";
const SPECIAL_SEED: string = "i83";

const rand = (seed: string): number => {
    let hash: number = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    const x: number = Math.sin((hash & 0x7FFFFFFF) % 100);

    return x - Math.floor(x);
}

const redirecrt = (req: VercelRequest, res: VercelResponse) => {
    const args: string | string[] = req.query.seed;
    if (Array.isArray(args)) {
        res.status(400).send('Bad Request');
        return;
    }

    try {
        const seed: string = args || new Date().getTime().toString();

        let link: string = "";

        // 读取数据库json文件
        let path: string = process.cwd();
        const data: string = readFileSync(`${path}/database.json`, 'utf-8');

        const links: string[] = JSON.parse(data);

        const random: number = Math.floor(rand(seed) * links.length);
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
        res.status(500).send(`Internal Server Error ${args} ${error}`);
    }
}

export default redirecrt;