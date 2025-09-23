<script>
    import Button from "$lib/Button.svelte";
    import Cover from "$lib/Cover.svelte";
    import CoverButton from "$lib/CoverButton.svelte";
    import Editor from "$lib/Editor.svelte";

    import AddIcon from "$lib/icons/Add.svg?raw";
</script>

<h1>Welcome to SvelteKit</h1>
<p>
    Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the
    documentation
</p>

<div class="components">
    <Button type="primary" icon={AddIcon}>Add to log</Button>
    <Button type="secondary">10 day streak</Button>
    <Button type="tertiary">I'm unused</Button>
    <Button icon={AddIcon} />
    <Button type="secondary" icon={AddIcon} />
    <Button type="tertiary" icon={AddIcon} />
    <Button type="link">I'm a link</Button>
    <Button type="primary" icon={AddIcon} disabled>Add to log</Button>
    <Button type="secondary" disabled>10 day streak</Button>
    <Button type="tertiary" disabled>I'm unused</Button>
    <Button type="link" disabled>I'm a link</Button>
</div>

<div class="components">
    <CoverButton icon={AddIcon}>Add a book</CoverButton>
    <Cover
        src="https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1607462569i/53152636.jpg"
        title="Mexican Gothic"
        author="Silvia Moreno-Garcia"
    />
    <Cover
        src="https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1718915012i/34066798.jpg"
        title="A Gentleman in Moscow"
        author="Amor Towles"
    />
</div>

<div class="components">
    <Editor />
</div>

<style>
    :global(body) {
        margin: 1rem;
    }

    .components {
        display: flex;
        gap: 10px;
        margin-bottom: 1rem;
    }
</style>
