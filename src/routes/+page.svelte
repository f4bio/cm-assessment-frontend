<script>
  // import Counter from './Counter.svelte';

  // import { User } from "../User";
  import { UserRestClient } from "../UserRestClient";
  import { onMount } from "svelte";
  import { faker } from "@faker-js/faker";
  // import Button from "@smui/button";
  import IconButton from "@smui/icon-button";
  import DataTable, { Body, Cell, Head, Label, Row } from "@smui/data-table";

  let sort = "id";
  let sortDirection = "ascending";

  function handleSort() {
    users.sort((a, b) => {
      const [aVal, bVal] = [a[sort], b[sort]][
        sortDirection === "ascending" ? "slice" : "reverse"
        ]();
      if (typeof aVal === "string" && typeof bVal === "string") {
        return aVal.localeCompare(bVal);
      }
      return Number(aVal) - Number(bVal);
    });
    users = users;
  }

  const client = new UserRestClient("http://localhost:3000");
  // let _prevUsers: User[] = [];
  let users = [];
  onMount(async () => {
    // _prevUsers = users || [];
    try {
      users = await client.loadAllItems();

      if (users.length < 10) {
        const _newUser = await client.insertItem({
          name: faker.person.fullName(),
          email: faker.internet.email(),
          password: faker.internet.password(),
          createdAt: faker.date.anytime().toISOString(),
          updatedAt: faker.date.anytime().toISOString(),
        });
        console.log(`Created new user '${_newUser.id}'`);
      }

      console.log(users);
    } catch (error) {
      console.error(error);
    }
  });
  // TODO
  //
  // possible features
  // - list users in a table
  // - detail user view
  // - add user
  // - modify user
  // - delete user
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
  <h1>User management</h1>

  {#if users}
    <!--suppress HtmlRequiredTitleElement -->
    <DataTable
      sortable
      bind:sortDirection
      on:SMUIDataTable:sorted={handleSort}
      table$aria-label="User list"
      style="width: 100%;">
      <Head>
        <Row>
          <!--
            Note: whatever you supply to "columnId" is
            appended with "-status-label" and used as an ID
            for the hidden label that describes the sort
            status to screen readers.

            You can localize those labels with the
            "sortAscendingAriaLabel" and
            "sortDescendingAriaLabel" props on the DataTable.
          -->
          <Cell numeric columnId="id">
            <!-- For numeric columns, icon comes first. -->
            <IconButton class="material-icons">arrow_upward</IconButton>
            <Label>ID</Label>
          </Cell>
          <Cell columnId="name" style="width: 100%;">
            <Label>Name</Label>
            <!-- For non-numeric columns, icon comes second. -->
            <IconButton class="material-icons">arrow_upward</IconButton>
          </Cell>
          <Cell columnId="password">
            <Label>Password</Label>
            <IconButton class="material-icons">arrow_upward</IconButton>
          </Cell>
          <Cell columnId="email">
            <Label>Email</Label>
            <IconButton class="material-icons">arrow_upward</IconButton>
          </Cell>
          <Cell columnId="createdAt">
            <Label>createdAt</Label>
            <IconButton class="material-icons">arrow_upward</IconButton>
          </Cell>
          <Cell columnId="updatedAt">
            <Label>updatedAt</Label>
            <IconButton class="material-icons">arrow_upward</IconButton>
          </Cell>
        </Row>
      </Head>
      <Body>
      {#each users as user (user.id)}
        <Row>
          <Cell numeric>{user.id}</Cell>
          <Cell>{user.name}</Cell>
          <Cell>{user.email}</Cell>
          <Cell>{user.password}</Cell>
          <Cell>{user.createdAt}</Cell>
          <Cell>{user.updatedAt}</Cell>
        </Row>
      {/each}
      </Body>
    </DataTable>

  {/if}
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}
</style>
