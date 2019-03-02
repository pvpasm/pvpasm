<template>
  <div>
    <b-card
      title="What is this?"
    >
      <p>
        This platform allows one to practice reverse engineering while competing with others.
      </p>
      <p>  
        Inspired by many of the platforms made to encourage coding practice such as Codefights and Hackerrank, as well as the pwn arena contest in the OpenToAll CTF Team (which led to <a href="https://pwnable.xyz">pwnable.xyz</a>), I created this site to make RE practice more fun.
      </p>
      
      <h6>
        <strong>Similar sites:</strong>
      </h6>
      <b-row>
        <ul>
          <li>          
            <a href="https://challenges.re">challenges.re</a>
          </li>
          <li>
            <a href="https://www.xorpd.net/pages/xchg_rax/snip_00.html">xorpd riddles</a>
          </li>
        </ul>
      </b-row>
    </b-card>

    <b-card
      class="mt-4"
      title="Support"
    >
      <p>
        This project is still in its early stage of development.
      </p>

      <p>
        Your support in any of the following forms will be very valuable.
      </p>

      <ul>
        <li>
          Contribute code on <a href="https://github.com/pvpasm/pvpasm">Github</a>
        </li>
        <li>
          Provide suggestions or report problems on <a href="#">Discord</a>
        </li>
        <li>
          Donate
        </li>
      </ul>
      
    </b-card>
  </div>
</template>

<script>
export default {
  name: 'About'
}
</script>
