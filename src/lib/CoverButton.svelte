<script>
    let { children, icon, ...rest } = $props();
</script>

<!-- TODO: This is not exhaustive or complete, but it does what I need it to for now -->

<button {...rest}>
    {#if icon}
        {@html icon}
    {/if}
    {@render children?.()}
</button>

<style>
    button {
        box-sizing: border-box;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 10px;
        gap: 10px;

        width: 200px;
        height: 300px;

        font-family: "EB Garamond", Garamond, serif;
        font-weight: 500;
        font-style: normal;
        font-size: 16px;
        line-height: 21px;

        border: 1px solid var(--dark-green);
        border-radius: 5px;

        flex: none;
        flex-grow: 0;

        color: var(--dark-green);
        background-color: transparent;

        &:not(:disabled) {
            &:hover,
            &:focus {
                background-color: color-mix(
                    in srgb,
                    transparent,
                    var(--dark-green) 10%
                );
            }
        }

        &:disabled {
            color: var(--dark-50);
            border-color: var(--dark-50);
        }
    }
</style>
