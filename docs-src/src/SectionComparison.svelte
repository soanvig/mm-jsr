<section class="page-section" id="comparison">
  <h2 class="header">Comparison</h2>
  <div class="comparison_wrapper">
    <table class="comparison">
      <caption>Comparison of some features of M&amp;M JSR with other tools</caption>
      <thead>
        <tr>
          <th />
          <th scope="col">M&amp;M JSR</th>
          <th scope="col">ion.rangeSlider</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">Dependencies</th>
          <td class="comparison_positive">None</td>
          <td class="comparison_negative">jQuery</td>
        </tr>
        <tr>
          <th scope="row">Size of minified version</th>
          <td class="comparison_positive">19.6 KB</td>
          <td class="comparison_negative">39.9 KB (126.6 KB with jQ)</td>
        </tr>
        <tr>
          <th scope="row">Any number of sliders</th>
          <td class="comparison_positive">Yes</td>
          <td class="comparison_negative">No (maximum 2)</td>
        </tr>
        <tr>
          <th scope="row">Support for touch</th>
          <td class="comparison_positive">Yes</td>
          <td class="comparison_negative">Yes, laggy</td>
        </tr>
        <tr>
          <th scope="row">Support for keyboard</th>
          <td class="comparison_positive">Yes</td>
          <td class="comparison_negative">Yes, laggy</td>
        </tr>
        <tr>
          <th scope="row">Collapsing labels</th>
          <td class="comparison_positive">Yes</td>
          <td class="comparison_positive">Yes</td>
        </tr>
        <tr>
          <th scope="row">Support for &lt;label&gt;</th>
          <td class="comparison_positive">Yes</td>
          <td class="comparison_negative">No</td>
        </tr>
        <tr>
          <th scope="row">Bar drag</th>
          <td class="comparison_positive">Yes</td>
          <td class="comparison_negative">No</td>
        </tr>
        <tr>
          <th scope="row">Grid</th>
          <td class="comparison_positive">Yes (canvas)</td>
          <td class="comparison_positive">Yes (DOM)</td>
        </tr>
        <tr>
          <th scope="row">Label formatting</th>
          <td class="comparison_positive">Yes</td>
          <td class="comparison_negative">No</td>
        </tr>
        <tr>
          <th scope="row">Limit values</th>
          <td class="comparison_positive">Yes</td>
          <td class="comparison_positive">Yes</td>
        </tr>
        <tr>
          <th scope="row">Modular</th>
          <td class="comparison_positive">Yes</td>
          <td class="comparison_negative">No</td>
        </tr>
      </tbody>
    </table>
  </div>
</section>

<style>
  .comparison_wrapper {
    max-width: 100%;
    overflow-x: auto;
  }

  .comparison {
    margin: 0 auto 1em;
    border-collapse: collapse;
  }

  .comparison td,
  .comparison th {
    border: 0;
    padding: 0.5em 1em;
  }

  .comparison tr:nth-child(even) {
    background: rgba(0, 0, 0, 0.4);
  }

  .comparison_positive {
    background: rgba(20, 150, 40, 0.5);
  }

  .comparison_negative {
    background: rgba(150, 0, 0, 0.7);
  }
</style>
