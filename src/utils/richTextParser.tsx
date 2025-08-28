type RichTextParserFunction = (keyTranslation: string) => React.ReactNode;

const richTextParser: RichTextParserFunction = (keyTranslation) => {
  // Regex améliorée pour gérer les guillemets doubles et simples
  const regex =
    /<strong>(.*?)<\/strong>|<a\s+href=['"]([^'"]*?)['"][^>]*?>(.*?)<\/a>|<br\s*\/?>/gi;

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let matchIndex = 0;

  keyTranslation.replace(regex, (match, boldText, aHref, aText, offset) => {
    // Ajouter le texte avant la balise
    if (lastIndex < offset) {
      parts.push(keyTranslation.substring(lastIndex, offset));
    }

    // <strong></strong>
    if (boldText) {
      parts.push(
        <span key={`bold-${matchIndex}`} className="font-bold">
          {boldText}
        </span>
      );
    }

    // <a href="..."></a>
    else if (aHref && aText) {
      parts.push(
        <a
          className="[&::after]:hidden!"
          href={aHref}
          key={`link-${matchIndex}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {aText}
        </a>
      );
    }

    // <br> ou <br/>
    else if (match.toLowerCase().startsWith("<br")) {
      parts.push(<br key={`br-${matchIndex}`} />);
    }

    lastIndex = offset + match.length;
    matchIndex++;

    return match;
  });

  // Ajouter le texte restant
  if (lastIndex < keyTranslation.length) {
    parts.push(keyTranslation.substring(lastIndex));
  }

  return <>{parts}</>;
};

export default richTextParser;
