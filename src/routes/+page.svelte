<script>
    import Button from "$lib/Button.svelte";
    import Cover from "$lib/Cover.svelte";
    import CoverButton from "$lib/CoverButton.svelte";
    import Graph from "$lib/Graph.svelte";
    import Modal from "$lib/Modal.svelte";
    import ProfilePhoto from "$lib/ProfilePhoto.svelte";

    import AddIcon from "$lib/icons/Add.svg?raw";
    import SettingsIcon from "$lib/icons/Settings.svg?raw";
    import StreakIcon from "$lib/icons/Streak.svg?raw";
    import BackIcon from "$lib/icons/Back.svg?raw";
    import BookmarkIcon from "$lib/icons/Bookmark.svg?raw";

    import FormatH1Icon from "$lib/icons/FormatH1.svg?raw";
    import FormatParagraphIcon from "$lib/icons/FormatParagraph.svg?raw";
    import FormatQuoteIcon from "$lib/icons/FormatQuote.svg?raw";
    import ImageIcon from "$lib/icons/Image.svg?raw";
    import FormatNumberedListIcon from "$lib/icons/FormatNumberedList.svg?raw";
    import FormatBulletedListIcon from "$lib/icons/FormatBulletedList.svg?raw";
    import EditIcon from "$lib/icons/Edit.svg?raw";
    import CheckIcon from "$lib/icons/Check.svg?raw";

    import { generateMockReadingLog, mockBookData } from "$lib/mock";

    import Editor from "$lib/Editor.svelte";
    import { onMount } from "svelte";

    let bookData = $state(mockBookData);
    let selectedBook = $state({
        uuid: null,
        title: null,
        authors: [],
        coverURL: null,
        dateCompleted: null,
        pages: null,
        notes: null,
    });

    let editor = $state();
    let editorState = $state({ editor: null });

    let notesSavingMessage = $state("");

    $effect(() => {
        if (selectedBook.notes && editor) {
            notesSavingMessage = "Saving changes...";
            // NOTE: Simulates database/server save time
            setTimeout(() => {
                notesSavingMessage = "";
            }, 1000);
        }
    });

    function setSelectedBook(uuid) {
        const bookIndex = bookData.findIndex((book) => book.uuid === uuid);
        selectedBook = bookData[bookIndex];
    }

    let logData = $state(generateMockReadingLog(35));
    const streak = $derived(getStreak(logData));

    const booksThisYear = $derived(
        bookData.filter((book) => {
            if (book.dateCompleted === undefined) return false;
            const date = new Date(book.dateCompleted * 1000);
            const today = new Date();
            return date.getFullYear() === today.getFullYear();
        }),
    );

    const currentlyReading = $derived(
        bookData.filter((book) => !book.dateCompleted),
    );

    let yearlyGoal = $state(24);

    let isAddToLogModalOpen = $state(false);

    let addToLogData = $state({
        pages: null,
        book: null,
        date: null,
        addMode: false,
    });

    let isSettingsModalOpen = $state(false);

    let settingsData = $state({
        yearlyGoal: null,
    });

    function openSettingsModal(defaults) {
        settingsData = {
            ...settingsData,
            yearlyGoal,
            ...defaults,
        };
        isSettingsModalOpen = true;
    }

    function saveSettings() {
        yearlyGoal = settingsData.yearlyGoal;
    }

    let isAddBookModalOpen = $state(false);
    let addBookData = $state({
        title: null,
        authors: null,
        coverURL: null,
        uuid: null,
    });

    function openAddBookModal(uuid) {
        console.log(uuid);
        if (uuid) {
            const bookIndex = bookData.findIndex((book) => book.uuid === uuid);
            addBookData.title = bookData[bookIndex].title;
            addBookData.authors = bookData[bookIndex].authors.join(", ");
            addBookData.coverURL = bookData[bookIndex].coverURL;
            addBookData.uuid = bookData[bookIndex].uuid;
        }
        isAddBookModalOpen = true;
    }

    function saveBook(title, authors, coverURL, uuid) {
        console.log(uuid);
        const book = {
            title,
            authors,
            coverURL,
        };
        if (!uuid) {
            uuid = crypto.randomUUID();
            bookData.unshift({
                ...book,
                uuid,
            });
        } else {
            const bookIndex = bookData.findIndex((book) => book.uuid === uuid);
            bookData[bookIndex] = {
                ...bookData[bookIndex],
                ...book,
            };

            if (uuid === selectedBook?.uuid) {
                selectedBook = bookData[bookIndex];
            }
        }
    }

    function clearAddBookData() {
        addBookData = {
            title: null,
            authors: null,
            coverURL: null,
            uuid: null,
        };
    }

    function getStreak(data) {
        let streak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = data.length - 1; i >= 0; i--) {
            const date = new Date(data[i].date * 1000);

            if (data[i].pages > 0) streak++;
            else if (date.getTime() === today.getTime()) continue;
            else return streak;
        }
        return streak;
    }

    function logReading(pages, uuid, date, addMode = false) {
        if (uuid) {
            const bookIndex = bookData.findIndex((book) => book.uuid === uuid);
            bookData[bookIndex].page += pages;
        }
        if (date) {
            date = new Date(date * 1000);
        } else {
            date = new Date();
        }
        date.setHours(0, 0, 0, 0);

        for (let i = logData.length - 1; i >= 0; i--) {
            const logDate = new Date(logData[i].date * 1000);

            if (date.getTime() === logDate.getTime()) {
                if (addMode) logData[i].pages += pages;
                else logData[i].pages = pages;
                break;
            }
            if (date > logData) {
                // Insert at the correct positions
                // NOTE: This should only ever be the end if an entry is generated for each day, but it
                // is technically able to handle any position
                logData.splice(i + 1, 0, {
                    date: Math.floor(date.getTime() / 1000),
                    page: pages,
                });
                break;
            }
        }
    }

    function clearAddToLogData() {
        addToLogData = {
            pages: null,
            book: null,
            date: null,
            addMode: false,
        };
    }

    function openAddToLogModal(date, pages, addMode) {
        addToLogData.date = date;
        addToLogData.pages = pages;
        addToLogData.addMode = addMode;
        isAddToLogModalOpen = true;
    }
</script>

<main>
    <div class="bookshelf">
        <div class="profile">
            <ProfilePhoto
                src="https://avatars.githubusercontent.com/u/46832494?v=4"
                name="Kevin Long"
            />
            <div class="user-stats">
                <h2>Kevin Long</h2>
                <p>Since 2018</p>

                <div class="user-buttons">
                    <Button
                        type="primary"
                        icon={AddIcon}
                        onclick={() => {
                            openAddToLogModal(null, null, true);
                        }}>Add to log</Button
                    >
                    {#if streak}
                        <Button
                            type="secondary"
                            icon={StreakIcon}
                            onclick={() => {
                                // TODO: This would ideally focus on the streak in the feed,
                                // but for now this will do
                                openAddToLogModal(null, null, true);
                            }}>{streak} day streak</Button
                        >
                    {/if}
                </div>
            </div>
            <!-- <Button type="link">View stats</Button> -->
        </div>
        <div class="books">
            <CoverButton
                icon={AddIcon}
                onclick={() => {
                    openAddBookModal();
                }}>Add a book</CoverButton
            >
            {#each bookData as book}
                <Cover
                    src={book.coverURL}
                    title={book.title}
                    author={book.authors.join(", ")}
                    onclick={() => {
                        setSelectedBook(book.uuid);
                    }}
                />
            {/each}
        </div>
    </div>
    <div class="pane">
        {#if !selectedBook?.uuid}
            <!-- TODO: This should probably be a separate component -->
            <div class="feed">
                <div class="feed-header">
                    <Button
                        type="tertiary"
                        icon={SettingsIcon}
                        onclick={() => {
                            openSettingsModal();
                        }}
                    />
                </div>
                {#if yearlyGoal}
                    <div class="feed-label-group">
                        <h2>{new Date().getFullYear()} Reading Goal</h2>
                        <p>
                            You’ve read <b
                                >{booksThisYear.length} book{booksThisYear.length !==
                                1
                                    ? "s"
                                    : ""}</b
                            >
                            so far this year! You’re on track to meet your goal of
                            <b>{yearlyGoal} book{yearlyGoal !== 1 ? "s" : ""}</b
                            >.
                        </p>
                        <Button type="link" onclick={openSettingsModal}
                            >Edit goal</Button
                        >
                    </div>
                    <div class="feed-group">
                        {#each booksThisYear as book}
                            <Cover
                                src={book.coverURL}
                                title={book.title}
                                author={book.authors.join(", ")}
                                scale={0.75}
                            />
                        {/each}
                    </div>
                {/if}
                <div class="feed-label-group">
                    <h2>Reading Streak</h2>
                    <p>
                        {#if streak !== 0}
                            You’re on a roll! You’ve logged reading for the past <b
                                >{streak} day{streak !== 1 ? "s" : ""}</b
                            >. Keep it up!
                        {:else}
                            You don’t have a streak right now. Try logging some
                            reading to start one!
                        {/if}
                    </p>
                    <Button
                        type="link"
                        onclick={() => {
                            openAddToLogModal(null, null, true);
                        }}>Add to log</Button
                    >
                </div>
                <div class="feed-group">
                    <Graph
                        data={logData}
                        onclick={(date, pages) => {
                            openAddToLogModal(date, pages);
                        }}
                    />
                </div>
            </div>
        {:else}
            <div class="notes">
                <div class="notes-header">
                    <div class="notes-nav">
                        <Button
                            type="tertiary"
                            icon={BackIcon}
                            onclick={() => {
                                selectedBook = null;
                            }}
                        />
                        <p>Return to log</p>
                    </div>
                    <b class="title">{selectedBook.title}</b>
                    <div class="author">{selectedBook.authors.join(", ")}</div>
                    <div class="book-edit">
                        <Button
                            type="tertiary"
                            icon={EditIcon}
                            onclick={() => {
                                openAddBookModal(selectedBook.uuid);
                            }}
                        />
                    </div>
                </div>
                <div class="notes-body">
                    <div class="metadata">
                        <h1>{selectedBook.title}</h1>
                        <h2>{selectedBook.authors.join(", ")}</h2>
                    </div>
                    {#key selectedBook.uuid}
                        <Editor
                            bind:editor
                            bind:editorState
                            bind:content={selectedBook.notes}
                        />
                    {/key}
                </div>
                <div class="notes-footer">
                    <div class="bookmark">
                        {@html BookmarkIcon}
                        <input
                            class="small"
                            type="number"
                            bind:value={selectedBook.page}
                        />
                        <Button
                            type={selectedBook.dateCompleted
                                ? "primary"
                                : "tertiary"}
                            icon={CheckIcon}
                            onclick={() => {
                                if (!selectedBook.dateCompleted) {
                                    selectedBook.dateCompleted = Math.floor(
                                        new Date().getTime() / 1000,
                                    );
                                } else {
                                    selectedBook.dateCompleted = null;
                                }
                            }}
                        />
                    </div>
                    <p class="save-message">{notesSavingMessage}</p>
                    {#if editor}
                        <Button
                            type={editorState.editor?.isActive("heading", {
                                level: 2,
                            })
                                ? "primary"
                                : "tertiary"}
                            icon={FormatH1Icon}
                            onclick={() => {
                                editor
                                    ?.chain()
                                    .focus()
                                    .toggleHeading({ level: 2 })
                                    .run();
                            }}
                        />
                        <Button
                            type={editorState.editor?.isActive("paragraph")
                                ? "primary"
                                : "tertiary"}
                            icon={FormatParagraphIcon}
                            onclick={() => {
                                editor?.chain().focus().setParagraph().run();
                            }}
                        />
                        <Button
                            type={editorState.editor?.isActive("blockquote")
                                ? "primary"
                                : "tertiary"}
                            icon={FormatQuoteIcon}
                            onclick={() => {
                                editor
                                    ?.chain()
                                    .focus()
                                    .toggleBlockquote()
                                    .run();
                            }}
                        />
                        <Button type="tertiary" icon={ImageIcon} />
                        <Button
                            type={editorState.editor?.isActive("orderedList")
                                ? "primary"
                                : "tertiary"}
                            icon={FormatNumberedListIcon}
                            onclick={() => {
                                editor
                                    ?.chain()
                                    .focus()
                                    .toggleOrderedList()
                                    .run();
                            }}
                        />
                        <Button
                            type={editorState.editor?.isActive("bulletList")
                                ? "primary"
                                : "tertiary"}
                            icon={FormatBulletedListIcon}
                            onclick={() => {
                                editor
                                    ?.chain()
                                    .focus()
                                    .toggleBulletList()
                                    .run();
                            }}
                        />
                    {/if}
                </div>
            </div>
        {/if}
    </div>
</main>
<div class="modal-overlay">
    {#if isAddToLogModalOpen}
        <Modal
            title="Add to log"
            details="Add your recent reading to your log to keep up or start your reading streak!"
            primaryLabel="Add to log"
            secondaryLabel="Cancel"
            primaryAction={() => {
                logReading(
                    addToLogData.pages,
                    addToLogData.book,
                    addToLogData.date,
                    addToLogData.addMode,
                );
                clearAddToLogData();
            }}
            closeModal={() => {
                isAddToLogModalOpen = false;
                clearAddToLogData();
            }}
        >
            <div class="modal-form">
                <div class="input-group">
                    <label for="pages">Pages</label>
                    <input
                        type="number"
                        name="pages"
                        id="pages"
                        required
                        bind:value={addToLogData.pages}
                    />
                </div>
                {#if addToLogData.addMode}
                    <div class="input-group grow">
                        <label for="book">Book</label>
                        <select
                            name="book"
                            id="book"
                            bind:value={addToLogData.book}
                        >
                            {#each currentlyReading as book}
                                <option value={book.uuid}
                                    >{book.title} — {book.authors.join(
                                        ", ",
                                    )}</option
                                >
                            {/each}
                        </select>
                    </div>
                {/if}
            </div>
        </Modal>
    {:else if isSettingsModalOpen}
        <Modal
            title="Settings"
            details="Customize your logging experience."
            primaryAction={() => {
                saveSettings();
            }}
            closeModal={() => {
                isSettingsModalOpen = false;
            }}
        >
            <div class="modal-form">
                <div class="input-group">
                    <label for="goal">Reading Goal</label>
                    <input
                        type="number"
                        name="goal"
                        id="goal"
                        bind:value={settingsData.yearlyGoal}
                    />
                </div>
                <!-- TODO: Currently the only way to change the theme is by changing prefers-color-scheme -->

                <!-- <div class="input-group">
                    <label for="theme">Color Theme</label>
                    <select name="theme" id="theme" bind:value={colorTheme}>
                        <option value="light">Light Mode</option>
                        <option value="dark">Dark Mode</option>
                    </select>
                </div> -->
            </div>
        </Modal>
    {:else if isAddBookModalOpen}
        <Modal
            title="Add a book"
            details="Add or edit a book on your bookshelf."
            primaryLabel="Save book"
            primaryAction={() => {
                saveBook(
                    addBookData.title,
                    addBookData.authors?.split(/,\s?/g),
                    addBookData.coverURL,
                    addBookData.uuid,
                );
            }}
            closeModal={() => {
                isAddBookModalOpen = false;
                clearAddBookData();
            }}
        >
            <div class="modal-form">
                <div class="input-group grow">
                    <label for="title">Title</label>
                    <input
                        type="text"
                        name="title"
                        id="title"
                        required
                        bind:value={addBookData.title}
                    />
                </div>
                <div class="input-group grow">
                    <label for="authors">Author(s)</label>
                    <input
                        type="text"
                        name="authors"
                        id="authors"
                        required
                        bind:value={addBookData.authors}
                    />
                </div>
                <div class="input-group grow full">
                    <label for="cover">Cover URL</label>
                    <input
                        type="text"
                        name="cover"
                        id="cover"
                        required
                        bind:value={addBookData.coverURL}
                    />
                </div>
            </div>
        </Modal>
    {/if}
</div>

<style>
    main {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        padding: 0px;

        position: relative;
        width: 100%;
        height: 100%;

        background: var(--light-cream);

        overflow: hidden;
    }

    .bookshelf {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding: 20px;
        gap: 20px;

        /* TODO: I really want this to be 640px but the scrollbar also takes up width when present so this will have to do for now */
        width: 660px;
        flex-shrink: 0;

        height: calc(100% - 40px);
        overflow-y: auto;
    }

    .books {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        align-items: flex-start;
        align-content: flex-start;
        padding: 0px;
        gap: 20px;

        flex: none;
        order: 1;
        flex-grow: 0;
    }

    .profile {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        padding: 10px;
        gap: 10px;

        flex: none;
        align-self: stretch;
        flex-grow: 0;
    }

    .user-stats {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: flex-start;
        padding: 0px 10px;

        flex: none;
        flex-grow: 1;
    }

    .user-buttons {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        padding: 20px 0px 10px;
        gap: 10px;

        flex: none;
        align-self: stretch;
        flex-grow: 0;
    }

    .pane {
        flex-grow: 1;
        align-self: stretch;
        min-width: 0;

        border-left: 1px solid var(--dark-20);

        height: 100%;
        overflow-y: auto;
    }

    .feed {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding: 40px;
        gap: 20px;

        flex-grow: 1;
        min-width: 0;
    }

    .feed-header {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
        padding: 0px;
        gap: 10px;

        flex: none;
        align-self: stretch;
        flex-grow: 0;
    }

    .feed-label-group {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding: 0px;

        flex: none;
        flex-grow: 0;
    }

    .feed-group {
        box-sizing: border-box;

        display: flex;
        flex-direction: row;
        align-items: flex-start;
        padding: 20px;
        gap: 20px;

        background: var(--white);

        border: 1px solid var(--dark-20);
        border-radius: 5px;

        overflow-x: auto;
        width: 100%;
        max-width: 680px;
    }

    .modal-overlay:not(:empty) {
        display: flex;
        align-items: center;
        justify-content: center;

        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;

        background-color: color-mix(in srgb, var(--dark) 75%, transparent);
    }

    .modal-form {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        align-items: flex-start;
        padding: 0px;
        gap: 20px;

        max-width: 100%;

        flex: none;
        align-self: stretch;
        flex-grow: 0;
    }

    .input-group {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding: 0px;
        gap: 10px;

        flex: none;
        flex-grow: 0;
    }

    .notes {
        background-color: var(--white);

        display: flex;
        flex-direction: column;
        align-items: flex-start;

        flex-grow: 1;
        min-width: 0;

        height: 100%;
    }

    .metadata {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding: 40px 40px 0px;

        flex: none;
        align-self: stretch;
        flex-grow: 0;
    }

    .notes-header {
        box-sizing: border-box;

        border-bottom: 1px solid var(--dark-20);

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 20px;

        flex: none;
        flex-grow: 0;
        z-index: 0;
        align-self: stretch;

        position: relative;
    }

    .notes-nav {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 0px;
        gap: 10px;

        position: absolute;
        left: 20px;

        flex: none;
        flex-grow: 0;
    }

    .book-edit {
        position: absolute;

        right: 20px;
    }

    .notes-body {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding: 0;

        flex: none;
        align-self: stretch;
        flex-grow: 1;
    }

    .notes-footer {
        box-sizing: border-box;

        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
        padding: 20px;
        gap: 10px;

        border-top: 1px solid var(--dark-20);

        flex: none;
        align-self: stretch;
        flex-grow: 0;
    }

    .bookmark {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 0px;
        gap: 5px;

        flex: none;
        flex-grow: 0;

        input {
            width: 64px;
        }
    }

    .save-message {
        flex-grow: 1;
        margin-left: 10px;
        margin-right: 10px;
    }

    .grow {
        flex-grow: 1;
    }

    .full {
        flex-basis: 100%;
    }
</style>
