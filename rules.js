/**
 * rules.js - Polish Grammar & Cultural Rules
 */

const grammarRules = {
    ordinalNumbers: {
        title: "1. Ordinal Numbers",
        explanation: "In English, we say 'January first'. In Polish, we always use ordinal numbers (1st, 2nd, 3rd) for the day. These must match the gender of the word 'day' (dzień), which is masculine.",
        rule: "Day numbers usually end in -y or -i.",
        example: "1st = pierwszy, 2nd = drugi, 3rd = trzeci"
    },
    monthCasing: {
        title: "2. The 'Of' Case (Genitive)",
        explanation: "This is the most important rule. We don't say '1 January'. We say '1st day OF January'. This possessive relationship changes the ending of the month name.",
        rule: "Most months change their ending to -a or -ego.",
        example: "Styczeń (January) becomes Stycznia (of January)"
    },
    yearStructure: {
        title: "3. Including the Year",
        explanation: "When saying the year, Poles add the word 'roku' (of the year) at the end. The year itself is also spoken as an ordinal number.",
        rule: "[Number] + roku",
        example: "2026 = dwa tysiące dwudziestego szóstego roku"
    }
};

export function getRulesHTML() {
    let html = `
        <article class="rules-container">
            <header class="rules-header">
                <h2>🇵🇱 Polish Date & Time Mastery</h2>
                <p>Understand the logic behind the endings.</p>
            </header>
            
            <h3 class="section-divider">🔄 Part 1: Contextual Ending Changes</h3>
            <section class="rule-block written-mode">
                <h3>🤝 Mode: (On the / At...) — Genitive/Locative</h3>
                <p>Used for <strong>appointments and events.</strong> (Answers: <em>When?</em>)</p>
                <div class="full-example">
                    <span class="highlight">Dziesiątego stycznia... / O godzinie dziesiątej...</span>
                </div>
            </section>

            <section class="rule-block spoken-mode">
                <h3>🗓️ Mode: (It is...) — Nominative</h3>
                <p>Used for <strong>naming the day or time.</strong> (Answers: <em>What time/day is it?</em>)</p>
                <div class="full-example">
                    <span class="highlight">Dziesiąty stycznia... / Godzina dziesiąta...</span>
                </div>
            </section>

            <hr class="rule-divider">
            <h3 class="section-divider">📖 Part 2: Core Principles</h3>
    `;

    Object.values(grammarRules).forEach(item => {
        html += `
            <section class="rule-block core-rule">
                <h4>${item.title}</h4>
                <p>${item.explanation}</p>
                <p><strong>Rule:</strong> ${item.rule}</p>
                <p><em>Example: ${item.example}</em></p>
            </section>
        `;
    });

    html += `
            <hr class="rule-divider">
            <h3 class="section-divider">🕒 Part 3: The "Half-To" Clock</h3>
            <section class="rule-block core-rule">
                <p>Poles don't look back at the hour passed; they look <strong>forward</strong> to the one coming. Instead of "Half past 4", we say <strong>"Half to 5"</strong> (Wpół do piątej).</p>
                <p><strong>Formula:</strong> Wpół do + [Next Hour in Locative case]</p>
            </section>

            <hr class="rule-divider">
            <h3 class="section-divider">🏠 Part 4: The "Room" Analogy</h3>
            <section class="rule-block analogy-section">
                <p>Think of Polish grammar like <strong>arranging furniture in a room:</strong></p>
                
                <div class="analogy-box blueprint">
                    <h4>🪑 Mode: (It is...) — The Catalog</h4>
                    <p>You are looking at a blueprint. You are simply naming the item: <em>"This is the <strong>Table</strong> (10th) of <strong>the Kitchen</strong> (January)."</em></p>
                    <p><strong>Result:</strong> Words stay in their "naming" form (Ending in <strong>-y</strong> or <strong>-a</strong>).</p>
                </div>

                <div class="analogy-box placement">
                    <h4>☕ Mode: (On the / At...) — The Placement</h4>
                    <p>You are placing a coffee <em>on the Table</em> at a specific time. Because the object is now part of an action/event, its "shape" (ending) changes to show its purpose.</p>
                    <p><strong>Result:</strong> Endings shift to <strong>-ego</strong> or <strong>-ej</strong>.</p>
                </div>
            </section>
        </article>
    `;

    return html;
}
