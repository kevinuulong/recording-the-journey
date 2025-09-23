<script>
    import { Editor } from "@tiptap/core";
    import Placeholder from "@tiptap/extension-placeholder";
    import { StarterKit } from "@tiptap/starter-kit";
    import { onDestroy, onMount } from "svelte";

    let element;

    let {
        editor = $bindable(),
        editorState = $bindable(),
        content = $bindable(),
        placeholder = "Click to start typing...",
    } = $props();

    onMount(() => {
        editor = new Editor({
            element,
            extensions: [
                StarterKit,
                Placeholder.configure({
                    placeholder,
                }),
            ],
            content,
            autofocus: "end",
            onTransaction: ({ editor }) => {
                // force re-render so `editor.isActive` works as expected
                editorState = { editor };
            },
            onUpdate: ({editor}) => {
                content = editor?.getJSON();
            }
        });
        editorState = { editor };
    });

    onDestroy(() => {
        editorState?.editor?.destroy();
    });
</script>

<div bind:this={element} class="editor"></div>

<style>
    .editor {
        align-self: stretch;
        flex-grow: 1;
    }

    :global(.ProseMirror) {
        outline: none;
        padding: 40px;
        height: calc(100% - 80px);
    }

    :global(.tiptap .is-empty::before) {
        color: #adb5bd;
        content: attr(data-placeholder);
        float: left;
        height: 0;
        pointer-events: none;
    }
</style>
