<script>
import { JSR, ModuleRail, ModuleSlider, ModuleBar, ModuleLabel } from "mm-jsr";
import { onMount } from 'svelte';

let jsrContainer;
let jsr;

onMount(() => {
	jsr = new JSR({
		modules: [
			new ModuleRail(),
			new ModuleSlider(),
			new ModuleBar(),
			new ModuleLabel(),
		],
		config: {
			min: 0,
			max: 100,
			step: 1,
			initialValues: [25,75, 90],
			container: jsrContainer,
		}
	});

	jsr.onValueChange(console.log)
});
</script>

<div class="jsr-container" bind:this={jsrContainer}>
	<style>
		[class^="jsr"] {
			box-sizing: border-box;
		}

		.jsr {
			display: block;

			position: relative;

			padding-top: 10px;

			width: 100%;

			-webkit-user-select: none;
				-moz-user-select: none;
					-ms-user-select: none;
							user-select: none;

			-webkit-touch-callout: none;
			-khtml-user-select: none;

			font: 14px sans-serif;
		}

		.jsr.is-disabled {
			background: grey;
		}

		.jsr_rail {
			height: 5px;
			background: #444;
		}

		.jsr_slider {
			position: absolute;
			top: calc(5px / 2 + 10px);
			left: 0;

			transform: translate(-50%, -50%);

			width: 25px;
			height: 25px;

			cursor: col-resize;
			transition: background 0.1s ease-in-out;

			outline: 0;

			z-index: 3;
		}

		.jsr_slider:focus {
			z-index: 4;
		}

		.jsr_slider::before {
			content: '';
			width: 15px;
			height: 15px;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			background: #999;
			border-radius: 50%;
		}

		.jsr_slider:focus::before {
			background: #c00;
		}

		.jsr_label {
			position: absolute;
			top: calc(10px + 5px + 15px / 1.5);
			transform: translateX(-50%);
			padding: 0.2em 0.4em;
			background: #444;
			color: #fff;
			font-size: 0.9em;
			white-space: nowrap;
			border-radius: 0.3em;
			z-index: 2;
			cursor: col-resize;
			opacity: 1;
		}

		.jsr_label.is-hidden {
			opacity: 0;
			pointer-events: none;
		}

		.jsr_bar {
			position: absolute;
			height: 5px;
			background-color: #999;
			z-index: 2;
			cursor: move;
			top: 10px;
		}

		.jsr_limit {
			position: absolute;
			z-index: 1;
			pointer-events: none;
			height: 5px;
			top: 10px;
			background-color: #727272;
		}

		.jsr_grid {
			margin-top: 5px;
			width: 100%;
		}

		.jsr_lockscreen {
			overflow: hidden;
			height: 100%;
			width: 100%;
		}
	</style>
</div>
