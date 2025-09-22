<script>
    let { src, name, scale = 1 } = $props();
</script>

<img {src} alt={name} style:--scale={scale} />

<style>
    img {
        display: block;
        border-radius: 50%;

        width: calc(80px * var(--scale));
        height: calc(80px * var(--scale));
        object-fit: cover;
        
        user-select: none;
        -webkit-user-drag: none;
        user-drag: none;
    }
</style>
