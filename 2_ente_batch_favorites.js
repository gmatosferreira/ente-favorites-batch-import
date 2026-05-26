(function () {
    'use strict';

    // Localization - change this string to match the "No results found" message of your region
    const NO_RESULTS_TEXT = "No results found";

    // List of filenames with extensions from the photos folder
    const photosWithExtension = [
        "VxH_ottkx_c",
        "bBvvNL28-aA",
        "no_results.jpg",
        "Jibt4cvMDb8"
    ];

    // Helper to wait
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    // Helper to map characters to KeyboardEvent standard codes
    const getKeyCode = (char) => {
        if (/[a-zA-Z]/.test(char)) return `Key${char.toUpperCase()}`;
        if (/[0-9]/.test(char)) return `Digit${char}`;
        if (char === '_') return "Minus";
        if (char === '.') return "Period";
        if (char === '-') return "Minus";
        if (char === '~') return "Backquote";
        if (char === '(') return "Digit9";
        if (char === ')') return "Digit0";
        if (char === ' ') return "Space";
        return "";
    };

    // Helper to simulate a full click sequence
    const simulateClick = (element) => {
        if (!element) return;
        const options = { bubbles: true, cancelable: true, view: window };
        element.dispatchEvent(new MouseEvent("mousedown", options));
        element.dispatchEvent(new MouseEvent("mouseup", options));
        element.click();
    };

    // Helper to download a CSV file
    const downloadCSV = (filename, headers, rows) => {
        const csvContent = [
            headers.join(","),
            ...rows.map(row => row.map(val => `"${val.replace(/"/g, '""')}"`).join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", filename);
            link.style.visibility = "hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    // Helper to update the floating button status and styles dynamically
    function setButtonStatus(state, text) {
        const btn = document.getElementById("sim-trigger-btn");
        if (!btn) return;

        btn.innerText = text;
        btn.style.pointerEvents = "none"; // Disable clicking during execution

        switch (state) {
            case "running":
                btn.style.backgroundImage = "linear-gradient(135deg, #ff9500 0%, #ffcc00 100%)";
                btn.style.boxShadow = "0 8px 24px rgba(255, 149, 0, 0.4)";
                break;
            case "typing":
                btn.style.backgroundImage = "linear-gradient(135deg, #fcd116 0%, #f1a80a 100%)";
                btn.style.boxShadow = "0 8px 24px rgba(241, 168, 10, 0.4)";
                break;
            case "finding":
                btn.style.backgroundImage = "linear-gradient(135deg, #007aff 0%, #0040dd 100%)";
                btn.style.boxShadow = "0 8px 24px rgba(0, 122, 255, 0.4)";
                break;
            case "opening":
                btn.style.backgroundImage = "linear-gradient(135deg, #4cd964 0%, #00b4d8 100%)";
                btn.style.boxShadow = "0 8px 24px rgba(0, 180, 216, 0.4)";
                break;
            case "success":
                btn.style.backgroundImage = "linear-gradient(135deg, #28a745 0%, #218838 100%)";
                btn.style.boxShadow = "0 8px 30px rgba(40, 167, 69, 0.6)";
                break;
            case "already":
                btn.style.backgroundImage = "linear-gradient(135deg, #ffcc00 0%, #e0a800 100%)";
                btn.style.boxShadow = "0 8px 30px rgba(255, 204, 0, 0.6)";
                break;
            case "error":
                btn.style.backgroundImage = "linear-gradient(135deg, #ff3b30 0%, #cc1100 100%)";
                btn.style.boxShadow = "0 8px 24px rgba(255, 59, 48, 0.5)";
                break;
            case "warning":
                btn.style.backgroundImage = "linear-gradient(135deg, #8e8e93 0%, #3a3a3c 100%)";
                btn.style.boxShadow = "0 8px 24px rgba(142, 142, 147, 0.4)";
                break;
            case "reset":
            default:
                btn.innerText = "🚀 Run favorites script";
                btn.style.backgroundImage = "linear-gradient(135deg, #ff6000 0%, #ff3b30 100%)";
                btn.style.boxShadow = "0 8px 24px rgba(255, 96, 0, 0.4)";
                btn.style.pointerEvents = "auto"; // Re-enable clicking
                break;
        }
    }

    let isRunning = false;

    async function runSimulation() {
        if (isRunning) return;
        isRunning = true;

        const photosNotFound = [];
        const photosSucceeded = [];

        const startTime = new Date();
        console.log(`Starting batch favorites simulation at ${startTime.toLocaleString()} for ${photosWithExtension.length} photos...`);

        for (let i = 0; i < photosWithExtension.length; i++) {
            const textToType = photosWithExtension[i];
            const progressStr = `[${i + 1}/${photosWithExtension.length}]`;
            console.log(`\n--- Processing Photo ${progressStr}: "${textToType}" ---`);

            setButtonStatus("running", `⏳ ${progressStr} Opening Search...`);

            // 1. Simulate CTRL+K (keydown & keyup) on both window and document to open Search bar
            console.log("Simulating CTRL+K...");
            const ctrlKDown = new KeyboardEvent("keydown", {
                key: "k",
                code: "KeyK",
                ctrlKey: true,
                bubbles: true,
                cancelable: true
            });
            const ctrlKUp = new KeyboardEvent("keyup", {
                key: "k",
                code: "KeyK",
                ctrlKey: true,
                bubbles: true,
                cancelable: true
            });

            window.dispatchEvent(ctrlKDown);
            document.dispatchEvent(ctrlKDown);
            window.dispatchEvent(ctrlKUp);
            document.dispatchEvent(ctrlKUp);

            // Wait for the search modal/input to open and receive focus
            await delay(500);

            // 2. Locate the active element (typically the search input after CTRL+K)
            let targetInput = document.activeElement;
            // console.log("Active element after CTRL+K:", targetInput);

            // Fallback if focus didn't move automatically
            if (!targetInput || (targetInput.tagName !== "INPUT" && targetInput.tagName !== "TEXTAREA")) {
                const searchInput = document.querySelector(
                    'input[type="search"], input[placeholder*="search" i], input[placeholder*="Search" i], #react-select-2-input'
                );
                if (searchInput) {
                    console.log("Fallback search input found:", searchInput);
                    targetInput = searchInput;
                }
            }

            let focusInterval = null;

            if (targetInput && (targetInput.tagName === "INPUT" || targetInput.tagName === "TEXTAREA" || targetInput.isContentEditable)) {
                setButtonStatus("typing", `✍️ ${progressStr} Typing...`);

                // Force visual focus
                const controlContainer = targetInput.closest('[class*="-control"]') || targetInput.parentElement || targetInput;
                simulateClick(controlContainer);
                simulateClick(targetInput);

                targetInput.focus();
                try { targetInput.select(); } catch (e) { }

                // Start a Focus Lock: continuously re-focus every 50ms to prevent focus-stealing during input
                focusInterval = setInterval(() => {
                    if (document.activeElement !== targetInput) {
                        targetInput.focus();
                        try { targetInput.select(); } catch (e) { }
                    }
                }, 50);

                await delay(200);

                // React-safe state updating logic
                const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                    window.HTMLInputElement.prototype,
                    "value"
                )?.set;

                if (nativeInputValueSetter) {
                    // Clear current value
                    nativeInputValueSetter.call(targetInput, "");
                    targetInput.dispatchEvent(new Event("input", { bubbles: true }));
                    await delay(100);

                    // Type each character and trigger corresponding key events
                    let currentVal = "";
                    for (const char of textToType) {
                        currentVal += char;
                        nativeInputValueSetter.call(targetInput, currentVal);

                        // Dispatch input event for React state binding
                        targetInput.dispatchEvent(new Event("input", { bubbles: true }));

                        // Key down, press, up simulation
                        const charCode = getKeyCode(char);
                        targetInput.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: char, code: charCode }));
                        targetInput.dispatchEvent(new KeyboardEvent("keypress", { bubbles: true, key: char, code: charCode }));
                        targetInput.dispatchEvent(new KeyboardEvent("keyup", { bubbles: true, key: char, code: charCode }));

                        await delay(30); // small delay to match natural typing speed
                    }
                } else {
                    // Direct assignment fallback
                    targetInput.value = "";
                    for (const char of textToType) {
                        targetInput.value += char;
                        targetInput.dispatchEvent(new Event("input", { bubbles: true }));
                        await delay(30);
                    }
                }
            } else {
                console.warn("No active text input detected. Simulating keystrokes on document.");
                for (const char of textToType) {
                    const charCode = getKeyCode(char);
                    document.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: char, code: charCode }));
                    await delay(50);
                }
            }

            // Keep the focus locked during the waiting delay to let React process input
            console.log("Waiting with persistent focus lock...");
            await delay(1000);

            // CRITICAL: Release the focus lock so the TAB press can successfully move focus away
            if (focusInterval) {
                clearInterval(focusInterval);
                console.log("Focus lock released.");
            }

            // Check if search returned "No results found" before simulating TAB
            const bodyText = document.body.innerText || "";
            if (bodyText.includes(NO_RESULTS_TEXT)) {
                console.warn(`"${NO_RESULTS_TEXT}" detected for "${textToType}"! Skipping.`);
                photosNotFound.push(textToType);
                setButtonStatus("warning", `❌ ${progressStr} Not Found`);
                await delay(1500);

                // Simulate ESC to close search bar
                console.log("Simulating ESC to close search bar...");
                const escDown = new KeyboardEvent("keydown", { bubbles: true, cancelable: true, key: "Escape", code: "Escape" });
                const escUp = new KeyboardEvent("keyup", { bubbles: true, cancelable: true, key: "Escape", code: "Escape" });
                document.dispatchEvent(escDown);
                document.dispatchEvent(escUp);

                await delay(500);
                continue; // Skip to next image
            }

            // Ensure the input is still active right before we simulate TAB
            if (targetInput) {
                targetInput.focus();
            }

            // 3. Simulate TAB press to trigger search execution/focus results
            console.log("Simulating TAB press...");
            const currentActive = document.activeElement || document;

            currentActive.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "Tab", code: "Tab" }));
            currentActive.dispatchEvent(new KeyboardEvent("keypress", { bubbles: true, key: "Tab", code: "Tab" }));
            currentActive.dispatchEvent(new KeyboardEvent("keyup", { bubbles: true, key: "Tab", code: "Tab" }));

            // Wait for search results to process/load
            setButtonStatus("finding", `🔍 ${progressStr} Finding Image...`);
            await delay(1200);

            // 4. Look for the first img element in search results and click on it
            console.log("Looking for the first image element...");
            const firstImg = document.querySelector('div[role="gridcell"] img, div[role="button"] img, .search-result img, img:not([src*="logo"]):not([src*="avatar"])') || document.querySelector('img');

            if (firstImg) {
                setButtonStatus("opening", `📸 ${progressStr} Opening Photo...`);
                // console.log("First image found. Clicking on it...", firstImg);
                const clickable = firstImg.closest('button, [role="button"], [role="gridcell"]') || firstImg;
                simulateClick(clickable);
            } else {
                console.warn(`No img element found for "${textToType}" on the page! Skipping.`);
                photosNotFound.push(textToType);
                setButtonStatus("warning", `❌ ${progressStr} Not Found`);
                await delay(1500);

                // Clear search input using Escape
                console.log("Simulating ESC to close search bar...");
                const escDown = new KeyboardEvent("keydown", { bubbles: true, cancelable: true, key: "Escape", code: "Escape" });
                const escUp = new KeyboardEvent("keyup", { bubbles: true, cancelable: true, key: "Escape", code: "Escape" });
                document.dispatchEvent(escDown);
                document.dispatchEvent(escUp);
                await delay(500);
                continue; // Skip to next image
            }

            // Wait for the photo viewer lightbox to fully open
            await delay(1500);

            // 5. Look for favorite button and check current state
            console.log("Looking for favorite button and status indicator...");
            const favBtn = document.querySelector('button.pswp__button--favorite');
            const favFill = document.querySelector('#pswp__icn-favorite-fill');

            let tagStatus = "Found";

            if (favBtn) {
                if (favFill && favFill.classList.contains('pswp__hidden')) {
                    console.log("Image is NOT favorited. Clicking favorite button...");
                    simulateClick(favBtn);
                    setButtonStatus("success", `✅ ${progressStr} Favorited!`);
                    tagStatus = "Favorited by Script";
                } else if (favFill) {
                    console.log("Image is already favorited. Skipping.");
                    setButtonStatus("already", `⭐ ${progressStr} Already Fav`);
                    tagStatus = "Already Favorited";
                } else {
                    // Fallback
                    console.log("Favorite indicator not found, clicking favorite button as fallback...");
                    simulateClick(favBtn);
                    setButtonStatus("success", `✅ ${progressStr} Toggled`);
                    tagStatus = "Toggled (Fallback)";
                }
            } else {
                console.warn("Favorite button not found on the page!");
                setButtonStatus("error", `⚠️ ${progressStr} Btn Not Found`);
                tagStatus = "Button Not Found";
            }

            photosSucceeded.push({ filename: textToType, status: tagStatus });

            // Wait a moment for UI state update to complete
            await delay(1000);

            // 6. Simulate ESC press to close the photo viewer lightbox
            console.log("Simulating ESC press to close photo viewer...");
            const escDown = new KeyboardEvent("keydown", { bubbles: true, cancelable: true, key: "Escape", code: "Escape" });
            const escUp = new KeyboardEvent("keyup", { bubbles: true, cancelable: true, key: "Escape", code: "Escape" });
            document.dispatchEvent(escDown);
            document.dispatchEvent(escUp);

            // Wait a brief moment for the lightbox to close before clicking
            if (tagStatus === "Favorited by Script") {
                console.log("Waiting 3000 ms before closing search (because photo favorited)...");
                await delay(3000);
            } else {
                console.log("Waiting 500 ms before closing search...");
                await delay(500);
            }

            // Click the MuiIconButton-root button
            const muiBtn = document.querySelector('button.MuiIconButton-root');
            if (muiBtn) {
                console.log("Clicking button.MuiIconButton-root...");
                simulateClick(muiBtn);
                // Wait another second
                await delay(1000);
            } else {
                console.warn("button.MuiIconButton-root not found!");
            }

            // Wait 500 ms between photos
            console.log("Waiting 500 ms before processing next item...");
            await delay(500);
        }

        console.log("All photos processed in batch!");

        const endTime = new Date();
        const durationMs = endTime - startTime;
        const durationSec = (durationMs / 1000).toFixed(2);
        console.log(`Finished batch favorites simulation at ${endTime.toLocaleString()}`);
        console.log(`Total duration: ${durationSec} seconds (${durationMs} ms)`);

        // Download Succeeded CSV
        if (photosSucceeded.length > 0) {
            console.log(`Downloading succeeded CSV with ${photosSucceeded.length} files...`);
            downloadCSV("succeeded_photos.csv", ["Filename", "Status"], photosSucceeded.map(item => [item.filename, item.status]));
            await delay(500); // 500ms delay before the next download to prevent browser block
        }

        // Download Not Found CSV
        if (photosNotFound.length > 0) {
            console.log(`Downloading not found CSV with ${photosNotFound.length} files...`);
            downloadCSV("not_found_photos.csv", ["Filename"], photosNotFound.map(f => [f]));
            await delay(500);
        }

        if (photosNotFound.length > 0) {
            console.warn("The following photos were not found in this run:");
            console.table(photosNotFound);
            alert(`Batch run complete! CSVs for succeeded and missing photos have been downloaded.\n\nTotal Duration: ${durationSec} seconds.`);
        } else {
            console.log("All photos were successfully found and processed!");
            alert(`Batch run complete!\n\nAll photos were successfully found and processed!\n\nCSV for succeeded photos has been downloaded.\n\nTotal Duration: ${durationSec} seconds.`);
        }

        setButtonStatus("success", "🎉 Run Complete!");
        await delay(5000);
        setButtonStatus("reset");
        isRunning = false;
    }

    // Injects the sleek floating trigger button onto the webpage
    function injectFloatingButton() {
        // Prevent duplicate injections
        if (document.getElementById("sim-trigger-btn")) return;

        const btn = document.createElement("button");
        btn.id = "sim-trigger-btn";
        btn.innerText = "🚀 Run favorites script";

        // CSS Styles for a premium floating button
        btn.style.position = "fixed";
        btn.style.bottom = "24px";
        btn.style.right = "24px";
        btn.style.zIndex = "999999";
        btn.style.padding = "14px 24px";
        btn.style.backgroundImage = "linear-gradient(135deg, #ff6000 0%, #ff3b30 100%)";
        btn.style.color = "#ffffff";
        btn.style.border = "none";
        btn.style.borderRadius = "50px";
        btn.style.fontFamily = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
        btn.style.fontSize = "14px";
        btn.style.fontWeight = "bold";
        btn.style.letterSpacing = "0.5px";
        btn.style.cursor = "pointer";
        btn.style.boxShadow = "0 8px 24px rgba(255, 96, 0, 0.4)";
        btn.style.transition = "transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.2s, filter 0.2s, background-image 0.2s";

        // Interactions
        btn.addEventListener("mouseover", () => {
            if (btn.style.pointerEvents !== "none") {
                btn.style.transform = "translateY(-4px) scale(1.05)";
                btn.style.boxShadow = "0 12px 30px rgba(255, 96, 0, 0.5)";
                btn.style.filter = "brightness(1.1)";
            }
        });
        btn.addEventListener("mouseout", () => {
            if (btn.style.pointerEvents !== "none") {
                btn.style.transform = "translateY(0) scale(1)";
                btn.style.boxShadow = "0 8px 24px rgba(255, 96, 0, 0.4)";
                btn.style.filter = "brightness(1)";
            }
        });
        btn.addEventListener("mousedown", () => {
            if (btn.style.pointerEvents !== "none") {
                btn.style.transform = "translateY(-1px) scale(0.98)";
            }
        });

        // Trigger on click
        btn.addEventListener("click", () => {
            runSimulation();
        });

        document.body.appendChild(btn);
        console.log("Floating action button injected successfully.");
    }

    // Auto-inject when the DOM is fully loaded or periodically
    if (document.readyState === "complete" || document.readyState === "interactive") {
        injectFloatingButton();
    } else {
        window.addEventListener("DOMContentLoaded", injectFloatingButton);
    }

    // Fallback: Check and inject periodically to handle SPAs where body changes
    setInterval(injectFloatingButton, 2000);

})();
