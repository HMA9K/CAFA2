const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');

const root = path.resolve(__dirname, '..');
const server = http.createServer((request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, 'http://local').pathname);
  const file = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
  if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
    response.writeHead(404); response.end(); return;
  }
  response.setHeader('Content-Type', ({
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8'
  })[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(response);
});

async function scrollState(page) {
  return page.evaluate(() => {
    const panel = document.querySelector('#exam-case-panel');
    const footer = document.querySelector('.exam-running .exam-footer');
    const question = document.querySelector('.exam-case-layout > .exam-question-body');
    const layout = document.querySelector('.exam-case-layout');
    const workHead = document.querySelector('.exam-work-head');
    const returnBar = document.querySelector('#study-returnbar');
    const topBar = document.querySelector('.topbar');
    const panelRect = panel.getBoundingClientRect();
    const footerRect = footer.getBoundingClientRect();
    const questionRect = question.getBoundingClientRect();
    return {
      pageY: window.scrollY,
      pageRange: document.documentElement.scrollHeight - window.innerHeight,
      documentHeight: document.documentElement.scrollHeight,
      viewportHeight: window.innerHeight,
      panelY: panel.scrollTop,
      panelRange: panel.scrollHeight - panel.clientHeight,
      questionY: question.scrollTop,
      questionRange: question.scrollHeight - question.clientHeight,
      panelRect: panelRect.toJSON(),
      layoutRect: layout.getBoundingClientRect().toJSON(),
      workHeadRect: workHead.getBoundingClientRect().toJSON(),
      footerRect: footerRect.toJSON(),
      questionRect: questionRect.toJSON(),
      headerBottom: Math.max(returnBar?.getBoundingClientRect().bottom || 0, topBar?.getBoundingClientRect().bottom || 0),
      overflowX: document.documentElement.scrollWidth > window.innerWidth + 1
    };
  });
}

function assertDesktopFrame(state, width) {
  assert.ok(state.workHeadRect.top >= state.headerBottom - 3,
    `${width}px: vraagkop blijft onder de bovenbalk`);
  assert.ok(state.layoutRect.top >= state.workHeadRect.bottom - 3,
    `${width}px: beide kolommen beginnen onder de vraagkop`);
  assert.ok(state.panelRect.top >= state.layoutRect.top - 3 && state.panelRect.bottom <= state.footerRect.top + 4,
    `${width}px: casus blijft tussen vraagkop en navigatiebalk`);
  assert.ok(state.questionRect.top >= state.layoutRect.top - 3 && state.questionRect.bottom <= state.footerRect.top + 4,
    `${width}px: antwoordkolom blijft tussen vraagkop en navigatiebalk`);
  assert.ok(state.footerRect.top > state.headerBottom && state.footerRect.bottom <= state.viewportHeight + 4,
    `${width}px: navigatiebalk blijft zichtbaar onder beide kolommen`);
}

(async () => {
  let browser;
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  try {
    browser = await chromium.launch({
      headless: true,
      ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {})
    });
    const base = process.env.TEST_BASE_URL || `http://127.0.0.1:${server.address().port}`;
    for (const [width, height] of [[1702, 1288], [1366, 900], [1024, 900], [820, 900], [390, 844]]) {
      const context = await browser.newContext({ viewport: { width, height } });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(String(error)));
      page.setDefaultTimeout(15000);

      await page.goto(`${base}/${width === 390 ? '' : 'index.html'}#welkom/cafa2-20250417`);
      await page.locator('[data-exam-untimed]').check();
      await page.locator('[data-exam-action="start"]').click();
      await page.locator('[data-exam-action="overview"]').click();
      await page.locator('#exam-info-dialog [data-exam-index="6"]').click();
      assert.match(await page.locator('.exam-position').innerText(), /VRAAG\s*7\s*VAN/);
      const panel = page.locator('#exam-case-panel');
      await panel.waitFor();
      await page.waitForFunction(() => {
        const panel = document.querySelector('#exam-case-panel');
        return panel && panel.scrollHeight > panel.clientHeight + 200;
      });

      const initial = await scrollState(page);
      if (process.env.DEBUG_SCROLL) console.log(`${width}px begin: ${JSON.stringify(initial)}`);
      assert.ok(initial.panelRange > 200, `${width}px: de lange casus moet zelfstandig kunnen scrollen`);
      assert.ok(!initial.overflowX, `${width}px: geen horizontale paginascroll`);
      assert.ok(initial.panelRect.left < initial.questionRect.left || width === 390,
        `${width}px: casus staat links van het antwoord op desktop`);

      if (width > 760) {
        assert.ok(initial.questionRange > 8,
          `${width}px: de rechter vraag- en antwoordkolom heeft eigen scrollruimte`);
        assertDesktopFrame(initial, width);
        await panel.evaluate(element => { element.scrollTop = 200; });
        const beforeRight = await scrollState(page);
        await page.mouse.move(initial.questionRect.left + 100, Math.min(500, initial.questionRect.top + 160));
        await page.mouse.wheel(0, 180);
        await page.waitForFunction(() => document.querySelector('.exam-case-layout > .exam-question-body').scrollTop > 5);
        const afterRight = await scrollState(page);
        assert.ok(afterRight.questionY > beforeRight.questionY + 5,
          `${width}px: muiswiel rechts scrolt de vraag- en antwoordkolom`);
        assert.ok(Math.abs(afterRight.panelY - beforeRight.panelY) <= 2,
          `${width}px: de casuspositie verandert niet bij rechts scrollen`);
        assert.ok(Math.abs(afterRight.pageY - beforeRight.pageY) <= 2,
          `${width}px: rechts scrollen beweegt de hoofdpagina niet`);
        assert.ok(Math.abs(afterRight.documentHeight - beforeRight.documentHeight) <= 5,
          `${width}px: documenthoogte blijft stabiel bij rechts scrollen`);
        assertDesktopFrame(afterRight, width);
      }

      const box = await panel.boundingBox();
      await page.mouse.move(box.x + Math.min(box.width / 2, 100), box.y + box.height / 2);
      await panel.evaluate(element => { element.scrollTop = 0; });
      const beforeInside = await scrollState(page);
      await page.mouse.wheel(0, 180);
      await page.waitForFunction(() => document.querySelector('#exam-case-panel').scrollTop > 10);
      const afterInside = await scrollState(page);
      assert.ok(afterInside.panelY > beforeInside.panelY + 10,
        `${width}px: muiswiel boven de casus scrolt eerst de casus`);
      assert.ok(Math.abs(afterInside.pageY - beforeInside.pageY) < 5,
        `${width}px: de pagina springt niet mee terwijl de casus nog kan scrollen`);
      if (width > 760) {
        assert.ok(Math.abs(afterInside.questionY - beforeInside.questionY) <= 2,
          `${width}px: de rechter kolom springt niet mee bij casusscroll`);
        assertDesktopFrame(afterInside, width);
      }

      await panel.evaluate(element => { element.scrollTop = element.scrollHeight; });
      const beforeEdge = await scrollState(page);
      await page.waitForTimeout(350);
      await page.mouse.wheel(0, 400);
      await page.waitForTimeout(80);
      await page.mouse.wheel(0, 400);
      if (width <= 760) {
        try {
          await page.waitForFunction(previous => window.scrollY > previous + 10, beforeEdge.pageY, { timeout: 2500 });
        } catch (_) {}
      }
      const afterEdge = await scrollState(page);
      if (process.env.DEBUG_SCROLL) console.log(`${width}px overloop: ${JSON.stringify({ beforeEdge, afterEdge })}`);
      assert.ok(afterEdge.panelY >= afterEdge.panelRange - 2,
        `${width}px: de casus blijft onderaan staan bij doorscrollen`);
      assert.ok(!afterEdge.overflowX, `${width}px: geen horizontale paginascroll na doorscrollen`);
      if (width > 760) {
        assert.ok(Math.abs(afterEdge.pageY - beforeEdge.pageY) <= 2,
          `${width}px: casusscroll aan het einde verplaatst de hoofdpagina niet`);
        assert.ok(Math.abs(afterEdge.questionY - beforeEdge.questionY) <= 2,
          `${width}px: casusscroll aan het einde verplaatst de rechter kolom niet`);
        assert.ok(Math.abs(afterEdge.documentHeight - beforeEdge.documentHeight) <= 5,
          `${width}px: documenthoogte blijft stabiel bij casusscroll`);
        assertDesktopFrame(afterEdge, width);
      } else {
        assert.ok(initial.pageRange > 20, `${width}px: mobiel gebruikt gewone documentflow`);
        assert.ok(initial.panelRect.bottom <= initial.questionRect.top + 3,
          `${width}px: mobiel staat de vraag onder de casus`);
        assert.ok(afterEdge.pageY > beforeEdge.pageY + 10,
          `${width}px: aan het einde van de casus loopt mobiel door op de hoofdpagina`);
      }

      if (width > 760) {
        await page.locator('.exam-case-layout > .exam-question-body').evaluate(element => {
          element.scrollTop = element.scrollHeight;
        });
        const rightEnd = await scrollState(page);
        assert.ok(rightEnd.questionY >= rightEnd.questionRange - 2,
          `${width}px: de onderste antwoordknoppen zijn bereikbaar door rechts te scrollen`);
        assert.ok(Math.abs(rightEnd.panelY - afterEdge.panelY) <= 2,
          `${width}px: de casus blijft op zijn plek bij doorscrollen rechts`);
        assertDesktopFrame(rightEnd, width);
      }

      await panel.evaluate(element => { element.scrollTop = 220; });
      const beforeNext = await scrollState(page);
      const answer = page.locator('#exam-app [contenteditable="true"]').first();
      await answer.fill(`Proefantwoord bij ${width}px`);
      await page.locator('[data-exam-action="next"]').click();
      assert.match(await page.locator('.exam-position').innerText(), /VRAAG\s*8\s*VAN/);
      const afterNext = await scrollState(page);
      assert.ok(Math.abs(afterNext.panelY - beforeNext.panelY) <= 3,
        `${width}px: Volgende binnen dezelfde opgave behoudt de leespositie in de casus`);
      if (width > 760) assertDesktopFrame(afterNext, width);
      assert.deepEqual(errors, [], `${width}px: geen JavaScript-fouten`);
      await context.close();
    }
    console.log('Tentamenscroll geslaagd: onafhankelijke desktopkolommen, mobiele documentflow, antwoord en navigatie.');
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
