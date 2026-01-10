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
            
            <h3 class="section-divider">🔄 Part 1: Date Contexts</h3>
            <section class="rule-block written-mode">
                <h3>🤝 Mode: (On the...) — Genitive</h3>
                <p>Used for <strong>appointments and events.</strong> (Answers: <em>When?</em>)</p>
                <div class="full-example">
                    <span class="highlight">Dziesiątego stycznia ... roku</span>
                </div>
            </section>

            <section class="rule-block spoken-mode">
                <h3>🗓️ Mode: (It is...) — Nominative</h3>
                <p>Used for <strong>naming the day.</strong> (Answers: <em>What day is it?</em>)</p>
                <div class="full-example">
                    <span class="highlight">Dziesiąty stycznia ... rok</span>
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

    // NEW TIME SECTION
    html += `
            <hr class="rule-divider">
            <h3 class="section-divider">🕒 Part 3: Telling Time</h3>
            <section class="rule-block core-rule">
                <h4>The "Half-To" Logic</h4>
                <p>Poles don't look back at the hour passed; they look <strong>forward</strong> to the one coming. Instead of "Half past 4", we say "Half to 5".</p>
                <p><strong>Phrase:</strong> Wpół do [Next Hour in Genitive]</p>
                <p><em>Example: 4:30 = Wpół do piątej (Half to fifth)</em></p>
                
                <h4 style="margin-top:20px;">Time Endings (-a vs -ej)</h4>
                <p>Just like dates, time changes based on the mode:</p>
                <ul>
                    <li><strong>(It is...) Mode:</strong> Use <em>-a</em> (Nominative). <br>Godzina czwart<strong>a</strong>.</li>
                    <li><strong>(At...) Mode:</strong> Use <em>-ej</em> (Locative). <br>O godzinie czwart<strong>ej</strong>.</li>
                </ul>
            </section>
    `;

    

    html += `
            <hr class="rule-divider">
            <h3 class="section-divider">🏠 Part 4: The "Room" Analogy</h3>
            <section class="rule-block analogy-section">
                <p>Think of Polish grammar like <strong>arranging furniture in a room.</strong> Here is how the analogy works with the two modes in this app:</p>
                
                <div class="analogy-box">
                    <h4>🪑 Mode: (It is...) — The Catalog</h4>
                    <p>You are looking at a blueprint. You are simply naming the item: <em>"This is the <strong>Table</strong> (10th) of <strong>the Kitchen</strong> (January)."</em></p>
                    <p><strong>Result:</strong> Words stay in their "naming" form (Nominative).</p>
                </div>

                <div class="analogy-box">
                    <h4>☕ Mode: (On the / At...) — The Placement</h4>
                    <p>You are placing a coffee <em>on the Table</em> at a specific time. Because the object is now part of an action/event, its "shape" (ending) changes to show its purpose (Genitive/Locative).</p>
                    <p><strong>Result:</strong> Endings shift to -ego/-ej.</p>
                </div>
            </section>
        </article>
    `;

    return html;
}
