<script>
    let { src, title, author, scale = 1 } = $props();
</script>

<div class="spine" style:--scale={scale}>
    <img class="cover" {src} alt={`${title} by ${author}`} />
</div>

<style>
    .cover {
        display: block;
        width: calc(200px * var(--scale));
        height: calc(300px * var(--scale));
        object-fit: cover;

        user-select: none;
        -webkit-user-drag: none;
        user-drag: none;
    }

    .spine {
        position: relative;
        display: inline-block;
        box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.5);

        overflow: hidden;
        border-radius: calc(2px * var(--scale));

        flex-shrink: 0;

        &::after {
            content: "";
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(
                90deg,
                rgba(0, 0, 0, 0.3) 0.06%,
                rgba(255, 255, 255, 0.3) 0.68%,
                rgba(0, 0, 0, 0.3) 2.03%,
                rgba(255, 255, 255, 0.3) 3.36%,
                rgba(255, 255, 255, 0) 4.12%
            );
        }
    }
</style>
