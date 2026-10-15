import { writeFileSync, readFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(__dirname, '../public');
mkdirSync(outDir, { recursive: true });

// Use the same content as the website and printable CV.
const source = readFileSync(resolve(__dirname, '../src/data/profile.ts'), 'utf8');
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const { profiles, contact } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);

function escapeRtf(text) {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const code = text.charCodeAt(i);
    if (char === '\\') result += '\\\\';
    else if (char === '{') result += '\\{';
    else if (char === '}') result += '\\}';
    else if (char === '\n') result += '\\par\n';
    else if (code > 127) result += `\\u${code > 32767 ? code - 65536 : code}?`;
    else result += char;
  }
  return result;
}

function generateRtfDocument(profile) {
  const cv = profile.printCv;
  let doc = '{\\rtf1\\ansi\\deff0\\nouicompat{\\fonttbl{\\f0\\fnil\\fcharset0 Arial;}}\n';
  doc += '{\\colortbl ;\\red23\\green45\\blue53;\\red78\\green98\\blue108;\\red0\\green91\\blue112;}\n';
  doc += '\\viewkind4\\uc1\\pard\\margl1440\\margr1440\\margt1440\\margb1440\\f0\\fs22\n';

  const paragraph = (text, format = '\\cf1\\fs22') => {
    doc += `${format} ${escapeRtf(text)}\\b0\\i0\\fs22\\par\n`;
  };
  const heading = (text) => {
    doc += '\\par\n';
    paragraph(text, '\\cf3\\b\\fs24');
  };

  paragraph(profile.name, '\\cf1\\b\\fs36');
  paragraph(profile.roleShort, '\\cf3\\b\\fs26');
  paragraph(`${contact.email} | ${contact.telegram} | ${contact.github} | ${profile.remote}`, '\\cf2\\fs18');
  paragraph(contact.website, '\\cf2\\fs18');
  doc += '\\par\n';
  paragraph(`${profile.summaryLead} ${profile.summaryTagline}`);

  heading(cv.sectionTitles.experience);
  for (const job of cv.jobs) {
    paragraph(`${job.role} — ${job.company}`, '\\cf1\\b');
    paragraph(job.dates, '\\cf2\\i');
    paragraph(job.meta);
    for (const highlight of job.highlights) {
      paragraph(`${highlight.label}: ${highlight.text}`);
    }
    doc += '\\par\n';
  }

  heading(cv.sectionTitles.skills);
  for (const skill of cv.skills) paragraph(`${skill.category}: ${skill.items}`);

  heading(cv.sectionTitles.education);
  paragraph(`${cv.education.school}, ${cv.education.faculty}`);
  for (const degree of cv.education.degrees) paragraph(degree);

  heading(cv.sectionTitles.languages);
  paragraph(cv.languagesAndProjects.languages);
  paragraph(cv.languagesAndProjects.project);
  doc += `{\\field{\\*\\fldinst HYPERLINK "${escapeRtf(cv.languagesAndProjects.projectUrl)}"}{\\fldrslt ${escapeRtf(cv.languagesAndProjects.projectUrl)}}}\\par\n`;

  return `${doc}}\n`;
}

for (const lang of ['en', 'ru']) {
  const filename = `Valentine-Shishkin-CV-${lang.toUpperCase()}.rtf`;
  const rtf = generateRtfDocument(profiles[lang]);
  writeFileSync(resolve(outDir, filename), rtf, 'utf8');
  const distDir = resolve(__dirname, '../dist');
  if (existsSync(distDir)) writeFileSync(resolve(distDir, filename), rtf, 'utf8');
}

console.log('Successfully generated RTF CVs in public/');
