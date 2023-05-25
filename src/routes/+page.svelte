<script>
  // import Counter from './Counter.svelte';
  import { UserRestClient } from "../UserRestClient";
  import { onMount } from "svelte";
  import { faker } from "@faker-js/faker";
  import Time from "svelte-time";
  import { Group, Label } from "@smui/button";
  import Fab, { Icon } from "@smui/fab";
  import IconButton from "@smui/icon-button";
  import DataTable, { Body, Cell, Head, Row } from "@smui/data-table";

  let sort = "id";
  let clicked = 0;
  let sortDirection = undefined;
  let users = [];

  function handleSort() {
    users = users.sort((a, b) => {
      const [aVal, bVal] = [a[sort], b[sort]][
        sortDirection === "ascending" ? "slice" : "reverse"
      ]();
      if (typeof aVal === "string" && typeof bVal === "string") {
        return aVal.localeCompare(bVal);
      }
      return Number(aVal) - Number(bVal);
    });
  }

  const client = new UserRestClient("http://localhost:3000");
  // let _prevUsers: User[] = [];
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

  <div class="flexy">
    <div class="margins">
      <Fab on:click={() => clicked++}>
        <Icon class="material-icons">favorite</Icon>
      </Fab>
    </div>
  </div>

  {#if users}
    <!--suppress HtmlRequiredTitleElement -->
    <DataTable
      sortable
      bind:sortDirection
      on:SMUIDataTable:sorted={handleSort}
      table$aria-label="User list"
      style="width: 100%;"
    >
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
          <Cell columnId="name">
            <Label>Name</Label>
            <IconButton class="material-icons">arrow_upward</IconButton>
          </Cell>
          <Cell columnId="email">
            <Label>Email</Label>
            <IconButton class="material-icons">arrow_upward</IconButton>
          </Cell>
          <Cell columnId="password">
            <Label>Password</Label>
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
          <Cell>
            <Label>Actions</Label>
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
            <Cell>
              <Time relative timestamp={user.createdAt} />
            </Cell>
            <Cell>
              <Time relative timestamp={user.updatedAt} />
            </Cell>
            <Cell>
              <Group>
                <IconButton class="material-icons" href="/">
                  search
                </IconButton>
                <IconButton class="material-icons" href="/">delete</IconButton>
              </Group>
            </Cell>
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
