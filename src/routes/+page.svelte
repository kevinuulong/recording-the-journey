<script>
    import Button from "$lib/Button.svelte";
    import Cover from "$lib/Cover.svelte";
    import Graph from "$lib/Graph.svelte";
    import Modal from "$lib/Modal.svelte";
    import ProfilePhoto from "$lib/ProfilePhoto.svelte";

    import AddIcon from "$lib/icons/Add.svg?raw";
    import SettingsIcon from "$lib/icons/Settings.svg?raw";
    import StreakIcon from "$lib/icons/Streak.svg?raw";

    import { generateMockReadingLog, mockBookData } from "$lib/mock";

    let logData = $state(generateMockReadingLog(35));
    const streak = $derived(getStreak(logData));

    let bookData = $state(mockBookData);
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
    let addToLogModal;

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
                            isAddToLogModalOpen = true;
                        }}>Add to log</Button
                    >
                    {#if streak}
                        <Button type="secondary" icon={StreakIcon}
                            >{streak} day streak</Button
                        >
                    {/if}
                </div>
            </div>
            <a href="#">View stats</a>
        </div>
        <div class="books">
            {#each bookData as book}
                <Cover
                    src={book.coverURL}
                    title={book.title}
                    author={book.authors.join(", ")}
                />
            {/each}
        </div>
    </div>
    <div class="feed">
        <div class="feed-header">
            <Button type="tertiary" icon={SettingsIcon} />
        </div>
        {#if yearlyGoal !== 0}
            <div class="feed-label-group">
                <h2>{new Date().getFullYear()} Reading Goal</h2>
                <p>
                    You’ve read <b
                        >{booksThisYear.length} book{booksThisYear.length !== 1
                            ? "s"
                            : ""}</b
                    >
                    so far this year! You’re on track to meet your goal of
                    <b>{yearlyGoal} book{yearlyGoal !== 1 ? "s" : ""}</b>.
                </p>
                <a href="#">Edit goal</a>
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
                    You don’t have a streak right now. Try logging some reading
                    to start one!
                {/if}
            </p>
            <a href="#">Add to log</a>
        </div>
        <div class="feed-group">
            <Graph data={logData} />
        </div>
    </div>
</main>
<div class="modal-overlay">
    {#if isAddToLogModalOpen}
        <Modal
            title="Add to log"
            details="Add your recent reading to your log to keep up or start your reading streak!"
            primaryLabel="Add to log"
            secondaryLabel="Cancel"
            closeModal={() => {
                isAddToLogModalOpen = false;
            }}
        >
            <div class="modal-form">
                <div class="input-group">
                    <label for="pages">Pages</label>
                    <input type="text" name="pages" id="pages" required />
                </div>
                <div class="input-group grow">
                    <label for="book">Book</label>
                    <select name="book" id="book">
                        {#each currentlyReading as book}
                            <option value={book.uuid}>{book.title} - {book.authors.join(", ")}</option>
                        {/each}
                    </select>
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

    .feed {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding: 40px;
        gap: 20px;

        border-left: 1px solid var(--dark-20);

        flex-grow: 1;
        overflow: hidden;
        align-self: stretch;
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
        align-items: flex-start;
        padding: 0px;
        gap: 20px;

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

    .grow {
        flex-grow: 1;
    }
</style>
