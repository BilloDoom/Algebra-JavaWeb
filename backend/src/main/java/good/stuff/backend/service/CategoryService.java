package good.stuff.backend.service;

import good.stuff.backend.common.dto.category.CategoryDto;
import good.stuff.backend.common.dto.category.CategoryImageDto;
import good.stuff.backend.common.model.category.Category;
import good.stuff.backend.repository.CategoryRepository;
import good.stuff.backend.utils.MapperUtils;
import good.stuff.backend.utils.XmlListUtil;  // <-- Use generic util here
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.function.Function;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    @Autowired
    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Transactional
    public CategoryDto createCategory(CategoryDto categoryDto) {
        Category categoryEntity = MapperUtils.map(categoryDto, Category.class);

        // Convert image DTO list to XML string before saving
        if (categoryDto.getImageUrls() != null) {
            categoryEntity.setImageUrls(XmlListUtil.toXml(
                    categoryDto.getImageUrls(),
                    "imageurls",
                    "url",
                    CategoryImageDto::getImageUrl
            ));
        }

        Category savedCategory = categoryRepository.save(categoryEntity);

        CategoryDto resultDto = MapperUtils.map(savedCategory, CategoryDto.class);

        // Parse XML string back to list for returning
        resultDto.setImageUrls(XmlListUtil.fromXml(
                savedCategory.getImageUrls(),
                "url",
                CategoryImageDto::new
        ));

        return resultDto;
    }

    public List<CategoryDto> getAllCategories() {
        List<Category> categories = categoryRepository.findAll();
        return categories.stream()
                .map(category -> {
                    CategoryDto dto = MapperUtils.map(category, CategoryDto.class);
                    dto.setImageUrls(XmlListUtil.fromXml(
                            category.getImageUrls(),
                            "url",
                            CategoryImageDto::new
                    ));
                    return dto;
                })
                .toList();
    }

    public Optional<CategoryDto> getCategoryById(Long id) {
        Optional<Category> category = categoryRepository.findById(id);
        return category.map(c -> {
            CategoryDto dto = MapperUtils.map(c, CategoryDto.class);
            dto.setImageUrls(XmlListUtil.fromXml(
                    c.getImageUrls(),
                    "url",
                    CategoryImageDto::new
            ));
            return dto;
        });
    }

    @Transactional
    public CategoryDto updateCategory(Long id, CategoryDto categoryDto) {
        Optional<Category> existingCategoryOptional = categoryRepository.findById(id);
        if (existingCategoryOptional.isPresent()) {
            Category existingCategory = existingCategoryOptional.get();

            // Map other fields first
            MapperUtils.mapToExisting(categoryDto, existingCategory);

            // Update imageUrls XML string
            if (categoryDto.getImageUrls() != null) {
                existingCategory.setImageUrls(XmlListUtil.toXml(
                        categoryDto.getImageUrls(),
                        "imageurls",
                        "url",
                        CategoryImageDto::getImageUrl
                ));
            } else {
                existingCategory.setImageUrls(null);
            }

            Category updatedCategory = categoryRepository.save(existingCategory);

            CategoryDto resultDto = MapperUtils.map(updatedCategory, CategoryDto.class);
            resultDto.setImageUrls(XmlListUtil.fromXml(
                    updatedCategory.getImageUrls(),
                    "url",
                    CategoryImageDto::new
            ));

            return resultDto;
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
