<script>
    let { children, type = "primary", icon, ...rest } = $props();

    const isIconButton = icon && !children;
</script>

<!-- TODO: Does passing a class to this overwrite the class I set here? -->
<button class={[type, { icon, "icon-button": isIconButton }]} {...rest}>
    {#if icon}
        {@html icon}
    {/if}
    {@render children?.()}
</button>

<style>
    button {
        box-sizing: border-box;

        border: 1px solid;

        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 6.5px 15px;
        gap: 5px;

        border-radius: 5px;

        font-family: "EB Garamond", Garamond, serif;
        font-weight: 500;

        font-family: "EB Garamond";
        font-style: normal;
        font-weight: 500;
        font-size: 16px;
        line-height: 21px;

        display: flex;
        align-items: center;
    }

    .icon {
        padding: 5px 15px 5px 10px;
    }

    .icon-button {
        padding: 5px;
    }

    .primary {
        color: var(--white);
        background: var(--dark-green);
        border-color: var(--dark-green);

        &:not(:disabled) {
            &:hover,
            &:focus {
                background-color: color-mix(
                    in srgb,
                    var(--dark-green),
                    var(--white) 10%
                );
            }
        }

        &:disabled {
            background: var(--dark-50);
            border-color: var(--dark-50);
        }
    }

    .secondary {
        color: var(--dark-green);
        border-color: var(--dark-green);
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

    .tertiary {
        color: var(--dark);
        background-color: transparent;
        border-color: transparent;

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
        }
    }
</style>
