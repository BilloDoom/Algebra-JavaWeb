package good.stuff.backend.service;

import good.stuff.backend.common.dto.category.CategoryDto;
import good.stuff.backend.common.model.category.Category;
import good.stuff.backend.repository.CategoryRepository;
import good.stuff.backend.utils.MapperUtils;
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

    public CategoryDto createCategory(CategoryDto CategoryDto) {
        Category categoryEntity = MapperUtils.map(CategoryDto, Category.class);
        Category savedCategory = categoryRepository.save(categoryEntity);
        return MapperUtils.map(savedCategory, CategoryDto.class);
    }

    public List<CategoryDto> getAllCategories() {
        List<Category> categories = categoryRepository.findAll();
        return categories.stream()
                .map(category -> MapperUtils.map(category, CategoryDto.class))
                .toList();
    }

    public Optional<CategoryDto> getCategoryById(Long id) {
        Optional<Category> category = categoryRepository.findById(id);
        return category.map(c -> MapperUtils.map(c, CategoryDto.class));
    }

    public CategoryDto updateCategory(Long id, CategoryDto CategoryDto) {
        Optional<Category> existingCategoryOptional = categoryRepository.findById(id);
        if (existingCategoryOptional.isPresent()) {
            Category existingCategory = existingCategoryOptional.get();

            MapperUtils.mapToExisting(CategoryDto, existingCategory);

            Category updatedCategory = categoryRepository.save(existingCategory);
            return MapperUtils.map(updatedCategory, CategoryDto.class);
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
