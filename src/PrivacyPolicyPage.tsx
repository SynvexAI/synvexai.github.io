import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import MainHeader from "./components/MainHeader";
import type { MainHeaderNavLink } from "./components/MainHeader";
import SiteFooter from "./SiteFooter";
import { useAutoTheme } from "./hooks/useAutoTheme";
import { ROUTES } from "./siteRoutes";
import privacyPolicyMarkdown from "../privacy-policy.md?raw";

type MarkdownBlock =
  | { type: "heading"; depth: 1 | 2 | 3; text: string; id: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] };

type MarkdownHeading = Extract<MarkdownBlock, { type: "heading" }>;
type MetaLabel = "Дата вступления в силу" | "Последнее обновление";

type ParsedMarkdown = {
  blocks: MarkdownBlock[];
  references: Record<string, string>;
};

type PolicySection = {
  heading: MarkdownHeading;
  blocks: MarkdownBlock[];
};

type PolicyDocument = {
  title: string;
  effectiveDate: string | null;
  updatedAt: string | null;
  summary: string;
  sections: PolicySection[];
};

const META_LABELS = new Set<MetaLabel>(["Дата вступления в силу", "Последнее обновление"]);
const INLINE_TOKEN_REGEX =
  /(\*\*.+?\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\)|\[[^\]]+\]\[[^\]]+\])/g;

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}

function buildHeadingId(text: string, usedIds: Map<string, number>) {
  const baseId = slugify(text) || "section";
  const count = usedIds.get(baseId) ?? 0;
  usedIds.set(baseId, count + 1);

  return count === 0 ? baseId : `${baseId}-${count + 1}`;
}

function collectReferenceLinks(markdown: string) {
  const references: Record<string, string> = {};
  const contentLines: string[] = [];

  for (const line of markdown.replace(/\r\n?/g, "\n").split("\n")) {
    const match = line.match(/^\[([^\]]+)\]:\s*(\S+)\s*$/);
    if (match) {
      references[match[1].trim().toLowerCase()] = match[2].trim();
      continue;
    }

    contentLines.push(line);
  }

  return {
    markdown: contentLines.join("\n").trim(),
    references,
  };
}

function isHeadingLine(line: string) {
  return /^(#{1,3})\s+/.test(line);
}

function isStandaloneLabeledLine(line: string) {
  return /^\*\*[^*]+:\*\*\s*/.test(line);
}

function parseMarkdown(markdown: string): ParsedMarkdown {
  const { markdown: normalizedMarkdown, references } = collectReferenceLinks(markdown);
  const lines = normalizedMarkdown.split("\n");
  const usedIds = new Map<string, number>();
  const blocks: MarkdownBlock[] = [];

  let index = 0;

  while (index < lines.length) {
    const line = lines[index].trim();

    if (!line) {
      index += 1;
      continue;
    }

    const headingMatch = line.match(/^(#{1,3})\s+(.*)$/);
    if (headingMatch) {
      const depth = headingMatch[1].length as 1 | 2 | 3;
      const text = headingMatch[2].trim();

      blocks.push({
        type: "heading",
        depth,
        text,
        id: buildHeadingId(text, usedIds),
      });
      index += 1;
      continue;
    }

    if (line.startsWith("* ")) {
      const items: string[] = [];

      while (index < lines.length) {
        const listLine = lines[index].trim();
        if (!listLine.startsWith("* ")) {
          break;
        }

        items.push(listLine.slice(2).trim());
        index += 1;
      }

      blocks.push({ type: "list", items });
      continue;
    }

    const paragraphLines = [line];
    index += 1;

    while (index < lines.length) {
      const nextLine = lines[index].trim();

      if (
        !nextLine ||
        nextLine.startsWith("* ") ||
        isHeadingLine(nextLine) ||
        isStandaloneLabeledLine(nextLine)
      ) {
        break;
      }

      paragraphLines.push(nextLine);
      index += 1;
    }

    blocks.push({
      type: "paragraph",
      text: paragraphLines.join(" "),
    });
  }

  return { blocks, references };
}

function parseMetaParagraph(text: string) {
  const match = text.match(/^\*\*([^*]+):\*\*\s*(.+)$/);
  if (!match) {
    return null;
  }

  const label = match[1].trim() as MetaLabel;
  if (!META_LABELS.has(label)) {
    return null;
  }

  return {
    label,
    value: match[2].trim(),
  };
}

function stripInlineMarkdown(text: string) {
  return text
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/`(.+?)`/g, "$1")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
    .replace(/\[([^\]]+)\]\[([^\]]+)\]/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function resolveReferenceHref(
  label: string,
  referenceId: string,
  references: Record<string, string>,
) {
  const resolvedHref = references[referenceId.toLowerCase()];
  if (resolvedHref) {
    return resolvedHref;
  }

  if (/^(?:https?:\/\/|mailto:)/i.test(label)) {
    return label;
  }

  if (/^[a-z0-9.-]+\.[a-z]{2,}(?:\/.*)?$/i.test(label)) {
    return `https://${label}`;
  }

  return null;
}

function renderInline(
  text: string,
  references: Record<string, string>,
  keyPrefix: string,
): ReactNode[] {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let tokenIndex = 0;
  INLINE_TOKEN_REGEX.lastIndex = 0;

  for (const match of text.matchAll(INLINE_TOKEN_REGEX)) {
    const token = match[0];
    const tokenStart = match.index ?? 0;

    if (tokenStart > lastIndex) {
      nodes.push(text.slice(lastIndex, tokenStart));
    }

    if (token.startsWith("**") && token.endsWith("**")) {
      nodes.push(
        <strong key={`${keyPrefix}-strong-${tokenIndex}`}>
          {renderInline(token.slice(2, -2), references, `${keyPrefix}-strong-${tokenIndex}`)}
        </strong>,
      );
    } else if (token.startsWith("`") && token.endsWith("`")) {
      nodes.push(
        <code key={`${keyPrefix}-code-${tokenIndex}`}>{token.slice(1, -1)}</code>,
      );
    } else {
      const inlineLinkMatch = token.match(/^\[([^\]]+)\]\((.+)\)$/);
      const referenceLinkMatch = token.match(/^\[([^\]]+)\]\[([^\]]+)\]$/);

      if (inlineLinkMatch) {
        const [, label, href] = inlineLinkMatch;
        nodes.push(
          <a key={`${keyPrefix}-link-${tokenIndex}`} href={href}>
            {renderInline(label, references, `${keyPrefix}-link-${tokenIndex}`)}
          </a>,
        );
      } else if (referenceLinkMatch) {
        const [, label, referenceId] = referenceLinkMatch;
        const href = resolveReferenceHref(label, referenceId, references);

        if (href) {
          nodes.push(
            <a key={`${keyPrefix}-ref-${tokenIndex}`} href={href}>
              {renderInline(label, references, `${keyPrefix}-ref-${tokenIndex}`)}
            </a>,
          );
        } else {
          nodes.push(token);
        }
      } else {
        nodes.push(token);
      }
    }

    lastIndex = tokenStart + token.length;
    tokenIndex += 1;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

function groupSections(blocks: MarkdownBlock[]) {
  const sections: PolicySection[] = [];
  let currentSection: PolicySection | null = null;

  for (const block of blocks) {
    if (block.type === "heading" && block.depth === 2) {
      currentSection = {
        heading: block,
        blocks: [],
      };
      sections.push(currentSection);
      continue;
    }

    if (!currentSection) {
      continue;
    }

    currentSection.blocks.push(block);
  }

  return sections;
}

function createPolicyDocument(parsed: ParsedMarkdown): PolicyDocument {
  const titleBlock = parsed.blocks.find(
    (block): block is MarkdownHeading => block.type === "heading" && block.depth === 1,
  );

  const contentBlocks = [...parsed.blocks];
  if (contentBlocks[0]?.type === "heading" && contentBlocks[0].depth === 1) {
    contentBlocks.shift();
  }

  let effectiveDate: string | null = null;
  let updatedAt: string | null = null;

  while (contentBlocks[0]?.type === "paragraph") {
    const meta = parseMetaParagraph(contentBlocks[0].text);
    if (!meta) {
      break;
    }

    if (meta.label === "Дата вступления в силу") {
      effectiveDate = meta.value;
    } else if (meta.label === "Последнее обновление") {
      updatedAt = meta.value;
    }

    contentBlocks.shift();
  }

  const firstParagraph = contentBlocks.find(
    (block): block is Extract<MarkdownBlock, { type: "paragraph" }> => block.type === "paragraph",
  );

  return {
    title: titleBlock?.text ?? "Политика конфиденциальности",
    effectiveDate,
    updatedAt,
    summary:
      stripInlineMarkdown(firstParagraph?.text ?? "") ||
      "Официальный документ SynvexAI о порядке обработки и защиты персональных данных.",
    sections: groupSections(contentBlocks),
  };
}

function renderSectionBlock(
  block: MarkdownBlock,
  references: Record<string, string>,
  sectionIndex: number,
  blockIndex: number,
) {
  if (block.type === "heading" && block.depth === 3) {
    return (
      <h3
        key={block.id}
        id={block.id}
        style={{
          marginTop: blockIndex === 0 ? 0 : "2.5rem",
          scrollMarginTop: "110px",
        }}
      >
        {block.text}
      </h3>
    );
  }

  if (block.type === "list") {
    return (
      <ul key={`list-${sectionIndex}-${blockIndex}`} className="setup-steps">
        {block.items.map((item, itemIndex) => (
          <li key={`list-${sectionIndex}-${blockIndex}-${itemIndex}`}>
            {renderInline(item, references, `list-${sectionIndex}-${blockIndex}-${itemIndex}`)}
          </li>
        ))}
      </ul>
    );
  }

  if (block.type === "paragraph") {
    return (
      <p key={`paragraph-${sectionIndex}-${blockIndex}`}>
        {renderInline(block.text, references, `paragraph-${sectionIndex}-${blockIndex}`)}
      </p>
    );
  }

  return null;
}

export default function PrivacyPolicyPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const { policyDocument, references } = useMemo(() => {
    const parsed = parseMarkdown(privacyPolicyMarkdown);
    return {
      policyDocument: createPolicyDocument(parsed),
      references: parsed.references,
    };
  }, []);

  useAutoTheme();

  useEffect(() => {
    document.title = `${policyDocument.title} | SynvexAI`;
  }, [policyDocument.title]);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop;
      setIsScrolled(y > 50);
      setShowTop(y > 400);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks: MainHeaderNavLink[] = [
    { label: "Главная", href: ROUTES.home },
    { label: "Политика", href: ROUTES.privacyPolicy, isActive: true },
  ];

  const contactSection = policyDocument.sections.find(
    (section) => section.heading.text === "20. Контакты",
  );

  return (
    <>
      <MainHeader isScrolled={isScrolled} navLinks={navLinks} />

      <main>
        <section className="hero content-section">
          <div className="container" style={{ textAlign: "center", maxWidth: "980px" }}>
            <h1 className="section-title">{policyDocument.title}</h1>
            <p style={{ maxWidth: "860px", margin: "0 auto" }}>{policyDocument.summary}</p>

            <ul className="feature-list" style={{ marginTop: "3rem", textAlign: "left" }}>
              {policyDocument.effectiveDate ? (
                <li className="feature-item">
                  <h3>Дата вступления в силу</h3>
                  <p>{policyDocument.effectiveDate}</p>
                </li>
              ) : null}
              {policyDocument.updatedAt ? (
                <li className="feature-item">
                  <h3>Последнее обновление</h3>
                  <p>{policyDocument.updatedAt}</p>
                </li>
              ) : null}
            </ul>
          </div>
        </section>

        <section id="policy-toc" className="content-section">
          <div className="container" style={{ maxWidth: "960px" }}>
            <h2 className="section-title">Содержание</h2>
            <ul className="setup-steps">
              {policyDocument.sections.map((section) => (
                <li key={section.heading.id}>
                  <a href={`#${section.heading.id}`}>{section.heading.text}</a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {policyDocument.sections.map((section, sectionIndex) => (
          <section
            key={section.heading.id}
            className="content-section"
            style={
              sectionIndex % 2 === 1 ? { backgroundColor: "var(--subtle-bg-color)" } : undefined
            }
          >
            <div className="container" style={{ maxWidth: "960px" }}>
              <h2
                id={section.heading.id}
                className="section-title"
                style={{ scrollMarginTop: "110px", marginBottom: "1.5rem" }}
              >
                {section.heading.text}
              </h2>
              {section.blocks.map((block, blockIndex) =>
                renderSectionBlock(block, references, sectionIndex, blockIndex),
              )}
            </div>
          </section>
        ))}
      </main>

      <SiteFooter />

      <button
        id="back-to-top"
        title="Наверх"
        style={{ display: showTop ? "flex" : "none" }}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <i className="fas fa-arrow-up"></i>
      </button>
    </>
  );
}
