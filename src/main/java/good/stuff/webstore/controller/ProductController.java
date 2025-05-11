package good.stuff.webstore.controller;

import good.stuff.webstore.common.dto.ProductDTO;
import good.stuff.webstore.common.model.Category;
import good.stuff.webstore.common.model.Product;
import good.stuff.webstore.service.CategoryService;
import good.stuff.webstore.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

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
    public String showProducts(
            @RequestParam(value = "categoryId", required = false) Long categoryId,
            @RequestParam(value = "maxPrice", required = false) BigDecimal maxPrice,
            Model model
    ) {
        List<ProductDTO> products;

        if (categoryId != null || maxPrice != null) {
            products = productService.getFilteredProducts(categoryId, maxPrice);
        } else {
            products = productService.getAllProducts();
        }

        model.addAttribute("products", products);
        model.addAttribute("categories", categoryService.getAllCategories());
        return "store/products";
    }


    //ADMIN
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin")
    public String adminDashboard(Model model) {
        model.addAttribute("products", productService.getAllProducts());
        model.addAttribute("categories", categoryService.getAllCategories());
        return "admin/products";
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/edit/{id}")
    public String editProductForm(@PathVariable Long id, Model model) {
        model.addAttribute("product", productService.getProductById(id).orElse(new ProductDTO()));
        model.addAttribute("categories", categoryService.getAllCategories());
        return "admin/edit_product";
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
