package good.stuff.webstore.controller;

import good.stuff.webstore.common.dto.ProductDTO;
import good.stuff.webstore.service.CategoryService;
import good.stuff.webstore.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/products")
public class ProductController {

    private final ProductService productService;
    private final CategoryService categoryService;

    @Autowired
    public ProductController(ProductService productService, CategoryService categoryService) {
        this.productService = productService;
        this.categoryService = categoryService;
    }

    //PUBLIC
    @GetMapping
    public String showProducts(Model model) {
        model.addAttribute("categories", categoryService.getAllCategories());
        return "store/products";
    }


    //ADMIN
    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public String showAdminProductPage(Model model) {
        model.addAttribute("products", productService.getAllProducts());
        model.addAttribute("categories", categoryService.getAllCategories());
        return "admin/admin-products";
    }


    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/edit/{id}")
    public String editProductForm(@PathVariable Long id, Model model) {
        model.addAttribute("product", productService.getProductById(id).orElse(new ProductDTO()));
        model.addAttribute("categories", categoryService.getAllCategories());
        return "admin/product-form";
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/admin/edit")
    public String updateProduct(@ModelAttribute ProductDTO productDTO, @RequestParam("categoryId") Long categoryId) {
        productDTO.setCategoryId(categoryId);
        productService.updateProduct(productDTO.getId(), productDTO);
        return "redirect:/products/admin";
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/admin/add")
    public String addProduct(@ModelAttribute ProductDTO productDTO, @RequestParam("categoryId") Long categoryId) {
        productDTO.setCategoryId(categoryId);
        productService.createProduct(productDTO);
        return "redirect:/products/admin";
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/delete/{id}")
    public String deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return "redirect:/products/admin";
    }

}
