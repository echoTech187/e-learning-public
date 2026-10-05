async function test() {
  const res = await fetch('http://api:80/api/v1/course-detail/b0def314-cf50-4d76-a6a1-792624d81888', {
    headers: { 'Host': 'api.e-learning.edu.id' }
  });
  console.log(res.status);
  const json = await res.json();
  console.log(JSON.stringify(json, null, 2));
}

test();
