package good.stuff.webstore.controller;

import good.stuff.webstore.common.dto.CategoryDTO;
import good.stuff.webstore.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/categories")
public class CategoryController {

    private final CategoryService categoryService;

    @Autowired
    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    //PUBLIC
    @ModelAttribute("categories")
    public List<CategoryDTO> populateCategories() {
        return categoryService.getAllCategories();
    }

    //ADMIN
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin")
    public String adminDashboard(Model model) {
        model.addAttribute("categories", categoryService.getAllCategories());
        return "admin/admin-categories";
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/edit/{id}")
    public String editCategoryForm(@PathVariable Long id, Model model) {
        model.addAttribute("category", categoryService.getCategoryById(id).orElse(new CategoryDTO()));
        return "admin/category-form";
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/admin/add")
    public String addCategory(@ModelAttribute CategoryDTO categoryDTO) {
        categoryService.createCategory(categoryDTO);
        return "redirect:/categories/admin";
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/admin/edit")
    public String updateCategory(@ModelAttribute CategoryDTO categoryDTO) {
        categoryService.updateCategory(categoryDTO.getId(), categoryDTO);
        return "redirect:/categories/admin";
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/delete/{id}")
    public String deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return "redirect:/categories/admin";
    }

}
