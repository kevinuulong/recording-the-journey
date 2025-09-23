<script>
    import Button from "./Button.svelte";

    import ChevronLeft from "$lib/icons/ChevronLeft.svg?raw";
    import ChevronRight from "$lib/icons/ChevronRight.svg?raw";

    let { data, onclick } = $props();

    let weekOffset = $state(0);
    const currentWeek = $derived.by(() => {
        const end = data.length + weekOffset * 7;
        const start = end - 7;
        return data.slice(start, end);
    });
    const weekMax = $derived(
        currentWeek.reduce((max, day) => Math.max(max, day.pages), 0),
    );

    let showTooltip = $state(false);
    let tooltipPosition = $state({ x: 0, y: 0 });
    let tooltipContent = $state("");

    const DAY = 24 * 60 * 60;
    const WEEK = DAY * 6;

    function handleMouseMove(e) {
        tooltipPosition = {
            x: e.clientX,
            y: e.clientY,
        };
    }

    function updateTooltip(pages) {
        tooltipContent = `${pages} page${pages != 1 ? "s" : ""}`;
    }

    function isToday(timestamp) {
        const ms = DAY * 1000;

        const date = new Date(timestamp * 1000);
        const today = new Date();
        today.setHours(0,0,0,0);

        // Compare the number of days since the UNIX epoch
        return (
            Math.floor(date.getTime() / ms) === Math.floor(today.getTime() / ms)
        );
    }

    function getWeekRange() {
        const startDate = new Date(currentWeek[0]?.date * 1000);
        const endDate = new Date(currentWeek.at(-1)?.date * 1000);

        const format = new Intl.DateTimeFormat(undefined, {
            month: "long",
            day: "numeric",
            year: "numeric",
        });

        return format.formatRange(startDate, endDate);
    }
</script>

<div class="graph">
    <Button
        type="tertiary"
        icon={ChevronLeft}
        onclick={() => {
            weekOffset--;
        }}
        disabled={data.length + weekOffset * 7 <= 7 || undefined}
    />
    <div class="area">
        <p class="title">{getWeekRange()}</p>
        <div
            class="bars"
            role="figure"
            onmousemove={handleMouseMove}
            onmouseenter={() => {
                showTooltip = true;
            }}
            onmouseleave={() => {
                showTooltip = false;
            }}
        >
            {#each currentWeek as day}
                <!-- TODO: Figure out what role this should have -->
                <div
                    class="bar-group"
                    role="region"
                    tabindex={0}
                    onmouseenter={() => {
                        updateTooltip(day?.pages);
                    }}
                    onclick={() => {
                        onclick(day?.date, day?.pages);
                    }}
                >
                    <div
                        class={["bar", { green: isToday(day?.date) }]}
                        style:--height={(day?.pages / weekMax) * 150}
                    ></div>
                    <p class="label">
                        {new Date(day?.date * 1000).toLocaleDateString(
                            undefined,
                            { weekday: "short" },
                        )}.
                    </p>
                </div>
            {/each}
        </div>
        {#if showTooltip}
            <div
                class="tooltip"
                style:--tooltip-x={tooltipPosition.x}
                style:--tooltip-y={tooltipPosition.y}
            >
                {tooltipContent}
            </div>
        {/if}
    </div>
    <Button
        type="tertiary"
        icon={ChevronRight}
        onclick={() => {
            weekOffset++;
        }}
        disabled={weekOffset === 0 || undefined}
    />
</div>

<style>
    .graph {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 20px;

        width: 100%;
    }

    .area {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 0px;
        gap: 20px;

        flex: none;
        flex-grow: 1;
    }

    .bars {
        display: flex;
        flex-direction: row;
        align-items: flex-end;
        padding: 0px;

        flex: none;
        align-self: stretch;
        flex-grow: 0;

        cursor: pointer;
    }

    .bar-group {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: center;
        padding: 5px 5px 0 5px;
        gap: 10px;

        height: 181px;

        flex: none;
        flex-grow: 1;
        flex-shrink: 0;

        &:hover,
        &:focus {
            background-color: color-mix(in srgb, var(--dark) 5%, var(--white));

            border-left: 1px solid var(--dark-20);
            border-right: 1px solid var(--dark-20);

            padding-left: 4px;
            padding-right: 4px;

            .bar:not(.green) {
                background: var(--dark-50);
            }
        }
    }

    .bar {
        height: calc(var(--height) * 1px);
        width: 100%;

        background: var(--dark-20);
        border-radius: 5px;

        flex: none;
        align-self: stretch;
        flex-grow: 0;

        &.green {
            background-color: var(--dark-green);
        }
    }

    .tooltip {
        position: absolute;

        background-color: var(--white);

        left: calc(var(--tooltip-x) * 1px + 10px);
        top: calc(var(--tooltip-y) * 1px + 10px);

        pointer-events: none;

        box-sizing: border-box;

        display: flex;
        flex-direction: row;
        align-items: flex-start;
        padding: 10px;
        gap: 10px;

        min-width: 100px;

        border: 1px solid var(--dark-20);
        box-shadow: 0px 5px 5px rgba(0, 0, 0, 0.25);
        border-radius: 5px;
    }
</style>
