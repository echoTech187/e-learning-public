async function test() {
  const detail = await fetch('http://api:80/api/v1/courses/developer-dengan-laravel-vue', {
      headers: { 'Host': 'api.e-learning.edu.id' }
  });
  console.log(detail.status);
  const detailJson = await detail.json();
  console.log(JSON.stringify(detailJson, null, 2));
}

test();
