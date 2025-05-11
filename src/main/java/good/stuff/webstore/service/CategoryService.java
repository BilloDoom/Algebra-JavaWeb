package good.stuff.webstore.service;

import good.stuff.webstore.common.dto.CategoryDTO;
import good.stuff.webstore.common.model.Category;
import good.stuff.webstore.repository.CategoryRepository;
import good.stuff.webstore.utils.MapperUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    @Autowired
    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public CategoryDTO createCategory(CategoryDTO categoryDTO) {
        Category categoryEntity = MapperUtils.map(categoryDTO, Category.class);
        Category savedCategory = categoryRepository.save(categoryEntity);
        return MapperUtils.map(savedCategory, CategoryDTO.class);
    }

    public List<CategoryDTO> getAllCategories() {
        List<Category> categories = categoryRepository.findAll();
        return categories.stream()
                .map(category -> MapperUtils.map(category, CategoryDTO.class))
                .toList();
    }

    public Optional<CategoryDTO> getCategoryById(Long id) {
        Optional<Category> category = categoryRepository.findById(id);
        return category.map(c -> MapperUtils.map(c, CategoryDTO.class));
    }

    public CategoryDTO updateCategory(Long id, CategoryDTO categoryDTO) {
        Optional<Category> existingCategoryOptional = categoryRepository.findById(id);
        if (existingCategoryOptional.isPresent()) {
            Category existingCategory = existingCategoryOptional.get();

            MapperUtils.mapToExisting(categoryDTO, existingCategory);

            Category updatedCategory = categoryRepository.save(existingCategory);
            return MapperUtils.map(updatedCategory, CategoryDTO.class);
        }
        return null;
    }

    public boolean deleteCategory(Long id) {
        Optional<Category> category = categoryRepository.findById(id);
        if (category.isPresent()) {
            categoryRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
