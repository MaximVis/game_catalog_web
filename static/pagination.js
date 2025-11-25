$(document).ready(function(){

  const scriptElement = $('script[src="static/pagination.js"]');
  const query = scriptElement.data('query');

  var load = 0;
  
  $(window).scroll(function(){
    if($(window).scrollTop() + $(window).height() >= $(document).height() - 50)
    {
      load += 10;
      let array_params =[load]
      if(query == "games_search_post" || query == 'developers_games' || query == 'developers_post' || query === 'developers_admin' || query === 'games_search_admin')
      {
        let param = scriptElement.data('query_param');
        array_params =[load, param]
      }

      if(query === 'developers_admin')
      {
        query_to_bd = 'developers_post';
      }
      else if(query === 'games_search_admin')
      {
        query_to_bd = 'games_search_post';
      }
      else
      {
        query_to_bd = query;
      }

      $.post("pagination.php", {array_params:array_params, query:query_to_bd}, function(data) {
      var response = JSON.parse(data);

      
      // Общие настройки
      const BASE_URL = 'https://k0j268qj-80.inc1.devtunnels.ms';

      // Конфигурация для разных типов запросов
      const queryConfig = {
        developers_get: {
          container: '.item.items_content',
          hrefTemplate: (name) => `${BASE_URL}/developers_games.php?input_items_search=${encodeURIComponent(name)}`,
          itemClass: 'item_rectangle',
          isDeveloper: true
        },
        developers_post: {
          container: '.item.items_content',
          hrefTemplate: (name) => `${BASE_URL}/developers_games.php?input_items_search=${encodeURIComponent(name)}`,
          itemClass: 'item_rectangle',
          isDeveloper: true
        },
        developers_admin: {
          container: '.item.items_content',
          hrefTemplate: (name) => `${BASE_URL}/admin_developers_page.php?input_items_search=${encodeURIComponent(name)}`,
          itemClass: 'item_rectangle',
          isDeveloper: true
        },
        games_search_admin: {
          container: '.container_main_page_content',
          hrefTemplate: (name) => `${BASE_URL}/game_admin.php?game=${encodeURIComponent(name)}`,
          itemClass: 'game_rectangle',
          isDeveloper: false
        },
        developers_games: {
          container: '.item.items_content',
          hrefTemplate: (name) => `${BASE_URL}/game.php?game=${encodeURIComponent(name)}`,
          itemClass: 'item_rectangle',
          isDeveloper: false
        },
        default: {
          container: '.container_main_page_content',
          hrefTemplate: (name) => `${BASE_URL}/game.php?game=${encodeURIComponent(name)}`,
          itemClass: 'game_rectangle',
          isDeveloper: false
        }
      };

      // Функция создания элемента для разработчика
      function createDeveloperElement(item, config) {
        return $('<a>', {
          href: config.hrefTemplate(item.autor_name),
          html: $('<div>', {
            class: config.itemClass,
            html: [
              $('<img>', {
                class: 'img_game_main',
                src: `devs_imgs/${item.autor_id}${item.extension}`,
                alt: item.autor_name
              }),
              $('<div>', {
                class: 'game_text_main',
                text: item.autor_name
              })
            ]
          })
        });
      }

      // Функция создания элемента для игры
      function createGameElement(item, config) {
        return $('<a>', {
          href: config.hrefTemplate(item.game_name)
        }).append(
          $('<div>', {
            class: config.itemClass
          }).append(
            $('<img>', {
              class: 'img_game_main',
              src: `game_imgs/${item.game_id}${item.extension}`,
              alt: item.game_name
            }),
            $('<div>', {
              class: 'game_text_main'
            }).append(
              $('<div>').text(item.game_name),
              $('<div>', {
                class: 'text_game_main_description',
                text: item.genres
              })
            )
          )
        );
      }

      // Функция создания элементов на основе конфигурации
      function createItems(response, config) {
        const container = $(config.container);
        const items = config.isDeveloper ? response.autor_id : response.game_id;
        const length = items.length;
        
        for (let i = 0; i < length; i++) {
          const item = {
            autor_id: response.autor_id?.[i],
            autor_name: response.autor_name?.[i],
            game_id: response.game_id?.[i],
            game_name: response.game_name?.[i],
            genres: response.genres?.[i],
            extension: response.extension?.[i]
          };
          
          const element = config.isDeveloper 
            ? createDeveloperElement(item, config)
            : createGameElement(item, config);
          
          container.append(element);
        }
      }

      // Основная логика
      const config = queryConfig[query] || queryConfig.default;

      // Создание элементов
      createItems(response, config);
           

  });
  }
});
});



// if(query === 'developers_get' || query === 'developers_post')
//       {
//         for (let i = 0; i < response.autor_id.length; i++)
//         {
//           console.log("1");
//           $(".item.items_content").append(
//             '<a href="https://k0j268qj-80.inc1.devtunnels.ms/developers_games.php?input_items_search=' + 
//             encodeURIComponent(response.autor_name[i]) + 
//             '"><div class="item_rectangle"><img class="img_game_main" src="devs_imgs/' + 
//             response.autor_id[i] + response.extension[i]+
//             '" alt="' + 
//             response.autor_name[i] + 
//             '"><div class="game_text_main">' + 
//             response.autor_name[i] + 
//             '</div></div></a>'
//           );
//         }
//       }
//       else if (query === 'developers_admin'){
//         for (let i = 0; i < response.autor_id.length; i++)
//         {
//           console.log("adm_pang_dev");
//           $(".item.items_content").append(
//             '<a href="https://k0j268qj-80.inc1.devtunnels.ms/admin_developers_page.php?input_items_search=' + 
//             encodeURIComponent(response.autor_name[i]) + 
//             '"><div class="item_rectangle"><img class="img_game_main" src="devs_imgs/' + 
//             response.autor_id[i] + response.extension[i]+
//             '" alt="' + 
//             response.autor_name[i] + 
//             '"><div class="game_text_main">' + 
//             response.autor_name[i] + 
//             '</div></div></a>'
//           );
//         }
//       }
//       else if('games_search_admin')
//       {
//         for (let i = 0; i < response.game_id.length; i++)
//         {
//           $(".container_main_page_content").append(
//             '<a href="https://k0j268qj-80.inc1.devtunnels.ms/game_admin.php?game=' + 
//             encodeURIComponent(response.game_name[i]) + 
//             '"><div class="game_rectangle"><img class="img_game_main" src="game_imgs/' + 
//             response.game_id[i] + response.extension[i]+
//             '" alt="' + 
//             response.game_name[i] + 
//             '"><div class="game_text_main">' + 
//             response.game_name[i] + 
//             '<div class="text_game_main_description">' + 
//             response.genres[i] + 
//             '</div></div></div></a>'
//           );
//         }
//       }
//       else
//       {
//         for (let i = 0; i < response.game_id.length; i++)
//         {
//           if (query == 'developers_games')
//           {
//             console.log("2");
//             $(".item.items_content").append(
//               '<a href="https://k0j268qj-80.inc1.devtunnels.ms/game.php?game=' + 
//               encodeURIComponent(response.game_name[i]) + 
//               '"><div class="item_rectangle"><img class="img_game_main" src="game_imgs/' + 
//               response.game_id[i] + response.extension[i]+
//               '" alt="' + 
//               response.game_name[i] + 
//               '"><div class="game_text_main">' + 
//               response.game_name[i] + 
//               '<div class="text_game_main_description">' + 
//               response.genres[i] + 
//               '</div></div></div></a>'
//             );
//           }
//           else
//           {
//             console.log("3");
//             $(".container_main_page_content").append(
//               '<a href="https://k0j268qj-80.inc1.devtunnels.ms/game.php?game=' + 
//               encodeURIComponent(response.game_name[i]) + 
//               '"><div class="game_rectangle"><img class="img_game_main" src="game_imgs/' + 
//               response.game_id[i] + response.extension[i]+
//               '" alt="' + 
//               response.game_name[i] + 
//               '"><div class="game_text_main">' + 
//               response.game_name[i] + 
//               '<div class="text_game_main_description">' + 
//               response.genres[i] + 
//               '</div></div></div></a>'
//             );
//           }
//         }
//       }


