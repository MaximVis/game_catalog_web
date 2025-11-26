document.addEventListener('DOMContentLoaded', function() {
    const list = document.getElementById('myList');

    if (!list) {
        return;
    }

    const scriptElement = $('script[src="static/search_items.js"]');
    const query_spec = scriptElement.data('query');
    const searchInput = document.getElementById('input_items_search');
    const items = Array.from(list.querySelectorAll('.selectable'));
    const maxVisibleItems = 6;
    let selectedItems = [];
    let load = 10;

    

    function initializeList() {
        updateListDisplay();
    }

    function onSelectedItemsChanged() {
        $(".item.items_content").empty();
        if(selectedItems.length == 0)
        {
            load = 0;
            default_list();
        }
        else{
            load = 0;
            variable_list();
        }
        
    }

    searchInput.addEventListener('input', function() {
        updateListDisplay();
    });

    list.addEventListener('click', function(e) {
        const clickedItem = e.target.closest('.selectable');
        if (!clickedItem) return;

        const itemText = clickedItem.textContent.trim();

        clickedItem.classList.toggle('selected');

        if (clickedItem.classList.contains('selected')) {
            if (!selectedItems.includes(itemText)) {
                selectedItems.unshift(itemText);
                onSelectedItemsChanged();
            }
        } else {
            selectedItems = selectedItems.filter(item => item !== itemText);
            onSelectedItemsChanged();
        }

        updateListDisplay();
    });

    function updateListDisplay() {
        const searchText = searchInput.value.toLowerCase();

        const filteredItems = items.filter(item => {
            return item.textContent.toLowerCase().includes(searchText);
        });

        const selectedAndFiltered = items.filter(item =>
            selectedItems.includes(item.textContent.trim()) &&
            item.textContent.toLowerCase().includes(searchText)
        );

        const otherFiltered = filteredItems.filter(item =>
            !selectedItems.includes(item.textContent.trim())
        );

        const itemsToShow = [
            ...selectedAndFiltered.slice(0, maxVisibleItems),
            ...otherFiltered.slice(0, Math.max(0, maxVisibleItems - selectedAndFiltered.length))
        ].slice(0, maxVisibleItems);

        items.forEach(item => {
            item.style.display = 'none';
        });

        itemsToShow.forEach(item => {
            item.style.display = '';
        });
    }

    initializeList();

    $(window).scroll(function() {
        if($(window).scrollTop() + $(window).height() >= $(document).height() - 50){
            if(selectedItems.length == 0)
            {
                default_list();
            } 
            else
            {
                variable_list();
            }
        }
      });

      function variable_list()
      {
        let query = query_spec;
        //let file_php = "genre_category_pag.php";
        let file_php = "pagination.php";
        let array_params = ['{' + selectedItems.map(item => `"${item}"`).join(',') + '}', selectedItems.length, load];
        pag_list(query, file_php, array_params);
        load += 10;
      }

      function default_list()
      {
        let query = 'games_search_get';
        let file_php = "pagination.php";
        let array_params =[load];
        pag_list(query, file_php, array_params);
        load += 10;
      }
      
      
      function pag_list(query, file_php, array_params)
      {		
        $.post(file_php, {array_params:array_params, query:query}, function(data) {
        var response = JSON.parse(data);
      
        for (let i = 0; i < response.game_id.length; i++)
        {
            $(".item.items_content").append(
    $('<a>', {
        href: '/game.php?game=' + encodeURIComponent(response.game_name[i])
    }).append(
        $('<div>', {
            class: 'item_rectangle'
        }).append(
            $('<img>', {
                class: 'img_game_main',
                src: 'game_imgs/' + response.game_id[i] + response.extension[i],
                alt: response.game_name[i]
            }),
            $('<div>', {
                class: 'game_text_main'
            }).append(
                $('<div>').text(response.game_name[i]),
                $('<div>', {
                    class: 'text_game_main_description',
                    text: response.genres[i]
                })
            )
        )
    )
);
        }
        });
      }
});