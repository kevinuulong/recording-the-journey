<script>
    import Button from "./Button.svelte";
    import CloseIcon from "$lib/icons/Close.svg?raw";

    let {
        title,
        details,
        closeModal,
        primaryLabel = "Save",
        secondaryLabel = "Close",
        primaryAction = () => {},
        secondaryAction = () => {},
        children,
        ...rest
    } = $props();

    function performAction(action) {
        action?.();
        closeModal();
    }
</script>

<div class="modal" {...rest}>
    <Button icon={CloseIcon} type="tertiary" onclick={closeModal} />
    <div class="content">
        <div class="label-group">
            <h2>{title}</h2>
            <p>{details}</p>
        </div>
        {@render children?.()}
        <div class="buttons">
            <Button
                type="secondary"
                onclick={() => {
                    performAction(secondaryAction);
                }}>{secondaryLabel}</Button
            >
            <Button
                type="primary"
                onclick={() => {
                    performAction(primaryAction);
                }}>{primaryLabel}</Button
            >
        </div>
    </div>
</div>

<style>
    .modal {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        padding: 30px;

        position: relative;
        width: fit-content;
        min-width: 600px;

        background: var(--white);
        border-radius: 5px;

        border: none;
    }

    .content {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding: 0px;
        gap: 40px;

        flex: none;
        align-self: stretch;
        flex-grow: 0;
    }

    .label-group {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding: 0px;

        flex: none;
        flex-grow: 0;
    }

    .buttons {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: flex-start;
        padding: 0px;
        gap: 10px;

        flex: none;
        align-self: stretch;
        flex-grow: 0;
    }
</style>
