import fs from 'fs';
import path from 'path';

const [,, title, ...contentParts] = process.argv;
if (!title || contentParts.length === 0) {
  console.error("Usage: node publish.js \"Title\" \"Document body here...\"");
  process.exit(1);
}

const content = contentParts.join(' ');
const date = new Date().toISOString().split('T')[0];
const fileName = `${date}-${title.replace(/\s+/g,'-')}.md`; // Markdown file
const documentsPath = path.join('./documents', fileName);

// 1️⃣ Save the document
fs.writeFileSync(documentsPath, `# ${title}\n\n${content}`);
console.log(`Document published: ${fileName}`);

// 2️⃣ Update the documents.html links
const documentFiles = fs.readdirSync('./documents')
  .filter(f => f.endsWith('.md'))
  .map(f => {
    const linkTitle = f.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/-/g, ' ').replace('.md','');
    return `<li><a href="./documents/${f.replace('.md','.html')}">${linkTitle}</a></li>`;
  });

const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Documents</title>
</head>
<body>
<h1>Documents</h1>
<ul>
${documentFiles.join('\n')}
</ul>
</body>
</html>
`;

fs.writeFileSync('./pages/documents.html', htmlContent);
console.log("Documents page updated!");
