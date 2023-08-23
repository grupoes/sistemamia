import puppeteer from "puppeteer";

async function getUniversidad() {
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 400
    })

    const page = await browser.newPage();

    await page.goto("https://www.sunedu.gob.pe/lista-universidades/")

    const result = await page.evaluate(() => {
        const datosArray = Array();
        const lista = document.querySelectorAll("#tablepress-22 tbody");

        lista.forEach(l => {
            console.log(l.innerText)
        });

        return lista;
    })

    console.log(result);
}

getUniversidad();