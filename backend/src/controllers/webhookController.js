const { PrismaClient } = require('@prisma/client');
const { spawn } = require('child_process');
const path = require('path');
const thingiPath = path.join(__dirname, '../../crawler/thingiverse/thingiverse.py');
const cgtraderPath = path.join(__dirname, '../../crawler/cgtrader/cgtrader.py');
const makerPath = path.join(__dirname, '../../crawler/makerworld/makerworld.py');
const printablesPath = path.join(__dirname, '../../crawler/printables/printables.py');
const thangsPath = path.join(__dirname, '../../crawler/thangs/thangs.py');
const pinshapePath = path.join(__dirname, '../../crawler/pinshape/pinshape.py');


const prisma = new PrismaClient();

const startScraping = async (req, res) => {
    try {
        console.log('Webhook triggered by Sanity');
        console.log(req.body);
        const {
            platform, 
            limit: modelLimit, 
            categoryCGTrader,
            categoryPinshape,
            thangsCategory,
            thangsSubcategory,
            printablesSubcategory
        } = req.body;
        

        if (platform === 'Thingiverse'){
            const pythonProcess = spawn('python', [thingiPath, modelLimit.toString()]);

            pythonProcess.stdout.on('data', (data) => {
                console.log(`stdout: ${data}`);
            });

            pythonProcess.stderr.on('data', (data) => {
                console.error(`stderr: ${data}`);
            });

            pythonProcess.on('close', (code) => {
                console.log(`thingiverse.py exited with code ${code}`);
            });
        };

        if (platform === 'CGTrader'){
            const pythonProcess = spawn('python', [cgtraderPath, categoryCGTrader, modelLimit.toString()]);

            pythonProcess.stdout.on('data', (data) => {
                console.log(`stdout: ${data}`);
            });

            pythonProcess.stderr.on('data', (data) => {
                console.error(`stderr: ${data}`);
            });

            pythonProcess.on('close', (code) => {
                console.log(`cgtrader.py exited with code ${code}`);
            });
        };

        if (platform === 'Makerworld'){
            const pythonProcess = spawn('python', [makerPath, modelLimit.toString()]);

            pythonProcess.stdout.on('data', (data) => {
                console.log(`stdout: ${data}`);
            });

            pythonProcess.stderr.on('data', (data) => {
                console.error(`stderr: ${data}`);
            });

            pythonProcess.on('close', (code) => {
                console.log(`makerworld.py exited with code ${code}`);
            });
        };

        if (platform === 'Pinshape'){
            const pythonProcess = spawn('python', [pinshapePath, categoryPinshape.toString(), modelLimit.toString()]);

            pythonProcess.stdout.on('data', (data) => {
                console.log(`stdout: ${data}`);
            });

            pythonProcess.stderr.on('data', (data) => {
                console.error(`stderr: ${data}`);
            });

            pythonProcess.on('close', (code) => {
                console.log(`pinshape.py exited with code ${code}`);
            });
        };

        if (platform === 'Printables'){
            const pythonProcess = spawn('python', [printablesPath, printablesSubcategory.toString(), modelLimit.toString()]);

            pythonProcess.stdout.on('data', (data) => {
                console.log(`stdout: ${data}`);
            });

            pythonProcess.stderr.on('data', (data) => {
                console.error(`stderr: ${data}`);
            });

            pythonProcess.on('close', (code) => {
                console.log(`printables.py exited with code ${code}`);
            });
        }

        if (platform === 'Thangs'){
            const pythonProcess = spawn('python', [thangsPath, thangsCategory, thangsSubcategory, modelLimit.toString()]);

            pythonProcess.stdout.on('data', (data) => {
                console.log(`stdout: ${data}`);
            });

            pythonProcess.stderr.on('data', (data) => {
                console.error(`stderr: ${data}`);
            });

            pythonProcess.on('close', (code) => {
                console.log(`thangs.py exited with code ${code}`);
            });
        }

        res.status(200).send('Webhook received and settings fetched');
    } catch (error) {
        console.error('Error handling webhook:', error);
        res.status(500).send('Internal Server Error');
    }

}

module.exports = { startScraping };
