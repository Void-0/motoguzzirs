// // Toggle the hamburger menu (to open/close nav bar)
// const hamburger = document.getElementById('hamburger');
// const navbar = document.getElementById('navbar');
//
// hamburger.addEventListener('click', () => {
//   navbar.classList.toggle('active');
// });
//
// document.querySelectorAll('.nav-item').forEach(item => {
//   const dropdown = item.querySelector('.dropdown');
//
//   item.addEventListener('click', (e) => {
//     if (dropdown) {
//       e.preventDefault(); // Prevent default link behavior
//
//       // Close all other dropdowns
//       document.querySelectorAll('.dropdown').forEach(otherDropdown => {
//         if (otherDropdown !== dropdown) {
//           otherDropdown.classList.remove('active');
//           otherDropdown.style.display = 'none';
//         }
//       });
//
//       // Toggle the current dropdown
//       const isActive = dropdown.classList.toggle('active');
//       dropdown.style.display = isActive ? 'flex' : 'none';
//     }
//   });
// });
