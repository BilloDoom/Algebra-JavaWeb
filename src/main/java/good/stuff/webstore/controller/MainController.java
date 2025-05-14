package good.stuff.webstore.controller;

import good.stuff.webstore.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class MainController {

    private final CategoryService categoryService;

    @Autowired
    public MainController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping({"/", "/index"})
    public String home(Model model) {
        model.addAttribute("categories", categoryService.getAllCategories());
        return "index";
    }
}
